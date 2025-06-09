import { Request, Response, Router } from 'express';

import { mcpSseController, oauthController } from './container';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('OK');
});

router.get('/sse', mcpSseController.getSse);
router.post('/messages', mcpSseController.postMessages);

router.get('/.well-known/oauth-authorization-server', oauthController.getWellKnown);
