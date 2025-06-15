import { OAUTH_API_BASE_URL } from './constants';
import { McpSseController } from './controllers/McpSseController';
import { OAuthController } from './controllers/OAuthController';
import { server } from './mcp/server';
import { McpSseAuthMiddleware } from './middlewares/McpSseAuthMiddleware';
import { StudentService } from './services/StudentService';
import { TokenService } from './services/TokenService';

const studentService = new StudentService();

const tokenService = new TokenService({
  studentService,
});

export const mcpSseAuthMiddleware = new McpSseAuthMiddleware({
  tokenService,
});

export const mcpSseController = new McpSseController({
  server,
})

export const oauthController = new OAuthController({
  oauthApiBaseUrl: OAUTH_API_BASE_URL,
});
