const generateAccessToken = (expiresIn) => 'ACCESS_TOKEN';
const generateRefreshToken = (expiresIn) => 'REFRESH_TOKEN';

export const postTokenHandler = (event) => {
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  const params = Object.fromEntries(new URLSearchParams(body));

  // TODO: Validate params.
  console.log('params', JSON.stringify(params));

  const accessTokenExpiresIn = 15 * 60; // 15 minutes
  const refreshTokenExpiresIn = 30 * 24 * 60 * 60; // 30 days
  const accessToken = generateAccessToken(accessTokenExpiresIn);
  const refreshToken = generateRefreshToken(refreshTokenExpiresIn);
  // Comes from the previously stored params.
  const scope = 'claudeai';

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: accessTokenExpiresIn,
      refresh_token: refreshToken,
      scope: scope,
    }),
  };
};
