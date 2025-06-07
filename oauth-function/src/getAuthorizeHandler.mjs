export const getAuthorizeHandler = (event) => {
  const params = event.queryStringParameters;

  // TODO: Validate params.
  console.log('params', JSON.stringify(params));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<html>
  <head>
    <title>Remote MCP PoC</title>
  </head>
  <body>
    <h1>Remote MCP PoC</h1>
    <form action="/oauth/authorize" method="post">
      <input type="hidden" name="client_id" value="${params.client_id}">
      <input type="hidden" name="code_challenge" value="${params.code_challenge}">
      <input type="hidden" name="code_challenge_method" value="${params.code_challenge_method}">
      <input type="hidden" name="redirect_uri" value="${params.redirect_uri}">
      <input type="hidden" name="response_type" value="${params.response_type}">
      <input type="hidden" name="scope" value="${params.scope}">
      <input type="hidden" name="state" value="${params.state}">
      <button type="submit">Authorize</button>
    </form>
  </body>
</html>
`,
  };
};
