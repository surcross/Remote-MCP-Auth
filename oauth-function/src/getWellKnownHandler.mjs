export const getWellKnownHandler = (event) => {
  const issuer = `https://${event.requestContext.domainName}`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      registration_endpoint: `${issuer}/oauth/register`,
      grant_types_supported: [
        'authorization_code',
        'client_credentials',
      ],
      code_challenge_methods_supported: ['S256'],
    }),
  };
};
