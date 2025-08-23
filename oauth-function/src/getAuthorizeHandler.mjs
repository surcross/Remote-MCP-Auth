export const getAuthorizeHandler = (event) => {
  const params = event.queryStringParameters;

  // TODO: Validate params, optionally store instead of passing through the form.
  console.log('用于测试getauth', 'params', JSON.stringify(params));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<html>
  <head>
    <title>Battle School Computer</title>
  </head>
  <body>
    <h1>Battle School Computer</h1>
    <form action="/oauth/authorize" method="post">
      <input name="student_id" placeholder="Student ID">
      <input type="hidden" name="client_id" value="${params.client_id}"> <!-- f07c54b1-4ee3-4288-bba7-3b5dd4c2ff53 -->
      <input type="hidden" name="code_challenge" value="${params.code_challenge}"> <!-- Hgh7EtmfmjkgmXdT7djwLkiqPq-IjVr7ZopcaB-KjPk -->
      <input type="hidden" name="code_challenge_method" value="${params.code_challenge_method}"> <!-- S256 -->
      <input type="hidden" name="redirect_uri" value="${params.redirect_uri}"> <!-- https://claude.ai/api/mcp/auth_callback -->
      <input type="hidden" name="response_type" value="${params.response_type}"> <!-- code -->
      <input type="hidden" name="scope" value="${params.scope}"> <!-- claudeai -->
      <input type="hidden" name="state" value="${params.state}"> <!-- SSYH43VrRJJhJaZKfIrLPvVeoaqF-2XbNDszOli5eRE -->
      <button type="submit">Authorize</button>
    </form>
  </body>
</html>
`,
  };
};
