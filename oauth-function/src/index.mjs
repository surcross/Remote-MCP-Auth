import { getAuthorizeHandler } from './getAuthorizeHandler.mjs';
import { getWellKnownHandler } from './getWellKnownHandler.mjs';
import { postAuthorizeHandler } from './postAuthorizeHandler.mjs';
import { postRegisterHandler } from './postRegisterHandler.mjs';
import { postTokenHandler } from './postTokenHandler.mjs';

const handlers = [
  {
    method: 'get',
    path: '/authorize',
    handler: getAuthorizeHandler,
  },
  {
    method: 'get',
    path: '/.well-known/oauth-authorization-server',
    handler: getWellKnownHandler,
  },
  {
    method: 'post',
    path: '/authorize',
    handler: postAuthorizeHandler,
  },
  {
    method: 'post',
    path: '/register',
    handler: postRegisterHandler,
  },
  {
    method: 'post',
    path: '/token',
    handler: postTokenHandler,
  },
];

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { requestContext: { http } } = event;

  const handler = handlers.find(({ method, path }) => (
    method === http.method.toLowerCase() && path === http.path.toLowerCase()
  ));

  if (!handler) {
    return { statusCode: 404 };
  }

  try {
    const result = await handler.handler(event);
    let headers = {};

    if (result.headers) {
      headers = { ...result.headers };
    }

    if (result.json) {
      headers['content-type'] = 'application/json';
    }

    let body;
    if (result.json) {
      body = JSON.stringify(result.json)
    } else if (result.body) {
      body = result.body;
    }

    return {
      statusCode: result.statusCode ? result.statusCode : 200,
      headers,
      body,
    };
  } catch (error) {
    console.error('Error thrown when executing handler', error);

    return { statusCode: 500 };
  }
};
