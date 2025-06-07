import { randomUUID } from 'crypto';

const generateClientId = () => randomUUID();

export const postRegisterHandler = (event) => {
  const params = JSON.parse(event.body);

  // TODO: Validate params.
  console.log('params', JSON.stringify(params));

  const clientId = generateClientId();

  // TODO: Store clientId and params.

  return {
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_name: params.client_name,
      grant_types: params.grant_types,
      response_types: params.response_types,
      token_endpoint_auth_method: params.token_endpoint_auth_method,
      scope: params.scope,
      redirect_uris: params.redirect_uris,
    }),
  };
};
