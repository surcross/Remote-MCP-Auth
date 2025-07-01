import { deleteCode, findCode } from './authCodes.mjs';
import { createAccessToken, createRefreshToken } from './tokens.mjs';

export const postTokenHandler = async (event) => {
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  const params = Object.fromEntries(new URLSearchParams(body));

  // TODO: Validate params.
  console.log('params', JSON.stringify(params));

  if (!params.code) {
    return { statusCode: 400 };
  }

  let code;
  try {
    code = await findCode(params.code);
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }

  if (!code) {
    return { statusCode: 400 };
  }

  try {
    await deleteCode(code.code);
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }

  const { accessToken, expiresIn } = createAccessToken(code.studentId);
  const { refreshToken } = createRefreshToken(code.studentId);
  // Comes from the previously stored params.
  const scope = 'claudeai';

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: refreshToken,
      scope: scope,
    }),
  };
};
