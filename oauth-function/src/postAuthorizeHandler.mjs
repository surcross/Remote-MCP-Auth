import { createCode } from './authCodes.mjs';

export const postAuthorizeHandler = async (event) => {
  // 这里的解析过程看的好累.看了好几次都看不懂了. 
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  const params = Object.fromEntries(new URLSearchParams(body));

  // TODO: Validate params.
  console.log('用于测试postauth', 'params', JSON.stringify(params));

  if (!params.student_id) {
    return { statusCode: 400 };
  }

  // TODO: Store the authorization `code` to bind the `client_id` to the authenticated user's consent, along with
  // `code_challenge`, `redirect_uri`, and `scope` for validation during token exchange.
  let code;
  try {
    code = await createCode(params.student_id, params.code_challenge);
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  } 

  const redirectUrl = new URL(params.redirect_uri);
  redirectUrl.searchParams.set('code', code); //jstools 用于写入请求部分的参数,不是很重要. 

  if (params.state) {
    redirectUrl.searchParams.set('state', params.state);
  }

  return {
    statusCode: 302,
    headers: { Location: redirectUrl.toString() },
  };
};
