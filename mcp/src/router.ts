import { Request, Response, Router } from 'express';

import { mcpSseAuthMiddleware, mcpSseController, oauthController } from './container';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('OK');
});

router.get('/sse', mcpSseAuthMiddleware.requireAuth, mcpSseController.getSse);
router.post('/messages', mcpSseAuthMiddleware.requireAuth, mcpSseController.postMessages);

router.get('/.well-known/oauth-authorization-server', oauthController.getWellKnown);
