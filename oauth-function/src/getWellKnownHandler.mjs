export const getWellKnownHandler = async (event) => {
  const issuer = `https://${event.requestContext.domainName}`;

  return {
    json: {
      issuer,
      authorization_endpoint: `${issuer}/authorize`,
      token_endpoint: `${issuer}/token`,
      registration_endpoint: `${issuer}/register`,
      grant_types_supported: [
        'authorization_code',
        'client_credentials',
      ],
      code_challenge_methods_supported: [
        'S256',
      ],
    },
  };
};
