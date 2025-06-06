export const getAuthorizeHandler = async (event) => {
  const { queryStringParameters } = event;

  return {
    headers: { 'Content-Type': 'text/html' },
    body: `
        <html>
          <form method="post" action="/authorize">
            <input type="hidden" name="client_id" value="${queryStringParameters.client_id}">
            <input type="hidden" name="code_challenge" value="${queryStringParameters.code_challenge}">
            <input type="hidden" name="redirect_uri" value="${queryStringParameters.redirect_uri}">
            <input type="hidden" name="state" value="${queryStringParameters.state}">
            <button type="submit">Authorize</button>
          </form>
        </html>
      `
  };
};
