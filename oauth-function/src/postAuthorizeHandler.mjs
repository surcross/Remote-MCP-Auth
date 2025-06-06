import { randomBytes } from 'crypto';

export const postAuthorizeHandler = async (event) => {
  let redirect_uri, state;

  if (event.queryStringParameters) {
    redirect_uri = event.queryStringParameters.redirect_uri;
    state = event.queryStringParameters.state;
  } else if (event.body) {
    const formEncoded = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
    const urlSearchParams = new URLSearchParams(formEncoded);
    const body = Object.fromEntries(urlSearchParams);
    redirect_uri = body.redirect_uri;
    state = body.state;
  }

  const code = randomBytes(32).toString('hex');

  // TODO: Store { code, client_id, redirect_uri, code_challenge, expires_at: Date.now() + 600000 }

  let location = `${redirect_uri}?code=${code}`;

  if (state) {
    location += `&state=${state}`;
  }

  return {
    statusCode: 302,
    headers: {
      Location: location,
    },
  };
};
