import { ACCESS_TOKEN_SECRET, OAUTH_API_BASE_URL } from './constants';

import { McpSseController } from './controllers/McpSseController';
import { McpStreamableController } from './controllers/McpStreamableController';
import { OAuthController } from './controllers/OAuthController';

import { McpServer } from './mcp/McpServer';

import { McpSseAuthMiddleware } from './middlewares/McpSseAuthMiddleware';

import { ArmyService } from './services/ArmyService';
import { StudentService } from './services/StudentService';
import { TokenService } from './services/TokenService';

const armyService = new ArmyService();

const studentService = new StudentService();

const tokenService = new TokenService({
  accessTokenSecret: ACCESS_TOKEN_SECRET,
  studentService,
});

const mcpServer = new McpServer({
  armyService,
  studentService,
});

export const mcpSseAuthMiddleware = new McpSseAuthMiddleware({
  tokenService,
});

export const mcpSseController = new McpSseController({
  mcpServer,
})

export const mcpStreamableController = new McpStreamableController({
  mcpServer,
});

export const oauthController = new OAuthController({
  oauthApiBaseUrl: OAUTH_API_BASE_URL,
});
