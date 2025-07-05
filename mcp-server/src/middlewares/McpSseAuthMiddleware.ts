import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types';
import { NextFunction, Request, Response } from 'express';

import { TokenService } from '../services/TokenService';

interface Options {
  tokenService: TokenService;
}

interface McpSseAuthenticatedRequest extends Request {
  auth?: AuthInfo;
}

export class McpSseAuthMiddleware {
  private readonly tokenService: TokenService;

  constructor({ tokenService }: Options) {
    this.tokenService = tokenService;

    this.requireAuth = this.requireAuth.bind(this);
  }

  public requireAuth(req: McpSseAuthenticatedRequest, res: Response, next: NextFunction): void {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      res.status(401).send('Unauthorized');
      return;
    }

    const token = req.headers.authorization.substring(7);

    if (!token) {
      res.status(401).send('Unauthorized');
      return;
    }

    const clientId = this.tokenService.validateToken(token);

    if (!clientId) {
      res.status(401).send('Unauthorized');
      return;
    }

    req.auth = {
      clientId,
      scopes: [],
      token,
    };

    next();
  }
}
