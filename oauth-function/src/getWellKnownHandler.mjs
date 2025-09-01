export const getWellKnownHandler = (event) => {  //试图让claude 通过cli aws 查看 sdk 中相关的内容容让我理解 .
                                                // 它好像看不到源码,但是它从日志中找了  event对象的完整结构....
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
