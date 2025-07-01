export const getAuthorizeHandler = (event) => {
  const params = event.queryStringParameters;

  // TODO: Validate params, optionally store instead of passing through the form.
  console.log('params', JSON.stringify(params));

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
