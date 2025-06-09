import { OAUTH_API_BASE_URL } from './constants';
import { McpSseController } from './controllers/McpSseController';
import { OAuthController } from './controllers/OAuthController';
import { server } from './mcp/server';

export const mcpSseController = new McpSseController({
  server,
})

export const oauthController = new OAuthController({
  oauthApiBaseUrl: OAUTH_API_BASE_URL,
});
