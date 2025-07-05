import { Request, Response, Router } from 'express';

import { mcpSseAuthMiddleware, mcpSseController, mcpStreamableController, oauthController } from './container';

export const router = Router();

// Health check.
router.get('/', (req: Request, res: Response) => {
  res.send('OK');
});

// SSE.
router.get('/sse', mcpSseAuthMiddleware.requireAuth, mcpSseController.getSse);
router.post('/messages', mcpSseAuthMiddleware.requireAuth, mcpSseController.postMessages);

// Streamable HTTP.
router.post('/mcp', mcpSseAuthMiddleware.requireAuth, mcpStreamableController.postMcp);
router.get('/mcp', mcpSseAuthMiddleware.requireAuth, mcpStreamableController.getMcp);
router.delete('/mcp', mcpSseAuthMiddleware.requireAuth, mcpStreamableController.deleteMcp);

// Auth-related.
router.get('/.well-known/oauth-authorization-server', oauthController.getWellKnown);
