import { randomBytes } from 'crypto';

const generateCode = () => randomBytes(32).toString('hex');

export const postAuthorizeHandler = (event) => {
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  const params = Object.fromEntries(new URLSearchParams(body));

  // TODO: Validate params.
  console.log('params', JSON.stringify(params));

  // The authorization code serves as a binding that ties the client ID (from the initial OAuth request) to the user ID
  // (established during authentication), created when the user approves the client's access request.

  const code = generateCode();

  // TODO: Store code and params.

  const redirectUrl = new URL(params.redirect_uri);
  redirectUrl.searchParams.set('code', code);

  if (params.state) {
    redirectUrl.searchParams.set('state', params.state);
  }

  return {
    statusCode: 302,
    headers: { Location: redirectUrl.toString() },
  };
};
