export const postTokenHandler = async (event) => {
  // const formEncoded = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  // const urlSearchParams = new URLSearchParams(formEncoded);
  // const body = Object.fromEntries(urlSearchParams);
  // TODO: Use body: grant_type, code, redirect_uri, client_id, code_verifier.

  return {
    json: {
      access_token: 'access_token',
      token_type: 'Bearer',
      expires_in: 3600,
    },
  };
};
