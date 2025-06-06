import { randomUUID } from 'crypto';

export const postRegisterHandler = async (event) => {
  const body = JSON.parse(event.body);
  const clientId = randomUUID();

  return {
    statusCode: 201,
    json: {
      client_id: clientId,
      client_name: body.client_name,
      redirect_uris: body.redirect_uris,
      grant_types: body.grant_types,
      response_types: body.response_types,
      token_endpoint_auth_method: body.token_endpoint_auth_method
    },
  };
};
