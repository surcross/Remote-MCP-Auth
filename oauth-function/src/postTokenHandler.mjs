import { createHash } from 'crypto';

import { deleteCode, findCode } from './authCodes.mjs';
import { createAccessToken, createRefreshToken, validateRefreshToken } from './tokens.mjs';

const computeChallenge = (verifier) => createHash('sha256')
  .update(verifier)
  .digest('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');

export const postTokenHandler = async (event) => {
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  const params = Object.fromEntries(new URLSearchParams(body));

  // TODO: Validate params.
  console.log('params', JSON.stringify(params));

  let studentId = null;

  if (params.grant_type === 'authorization_code') {
    if (!params.code || !params.code_verifier) { 
      return { statusCode: 400 };
    }

    let code;
    try {
      code = await findCode(params.code); //从authcodestable读了一条出来,因为aws sdk 封装过,所以读出来就是这么个js对象里面
                                       //包含code,codeChallenge,expiration,studentId 
    } catch (error) {
      console.error(error);
      return { statusCode: 500 };
    }

    console.log('查询到的code对象结构:', JSON.stringify(code, null, 2)); //打印code对象结构方便调试
    
    if (!code || !code.code || !code.codeChallenge || !code.studentId) {
      return { statusCode: 400 };
    }

    if (computeChallenge(params.code_verifier) !== code.codeChallenge) {
      return { statusCode: 400 };
    }

    try {
      await deleteCode(code.code);
    } catch (error) {
      console.error(error);
      return { statusCode: 500 };
    }

    studentId = code.studentId;
  } else if (params.grant_type === 'refresh_token') {
    if (!params.refresh_token) {
      return { statusCode: 400 };
    }

    const refreshTokenPayload = validateRefreshToken(params.refresh_token);

    if (!refreshTokenPayload) {
      return { statusCode: 400 };
    }

    studentId = refreshTokenPayload.sub;
  } else {
    return { statusCode: 400 };
  }

  //这里是为后续的mcp游戏的代码做准备的. 
  const { accessToken, expiresIn } = createAccessToken(studentId);
  const { refreshToken } = createRefreshToken(studentId); //refreshtoken的逻辑就不管了.先把主体认证授权流程搞定.
  // Comes from the previously stored params.
  const scope = 'claudeai';//这里的作用域语法是什么? 没什么语法 感觉和well-known差不多,就是通知你一下. 是用于哪里的. 

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: refreshToken,
      scope: scope,
    })
  };
};
