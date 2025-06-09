import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { Request, Response } from 'express';

interface Options {
  server: McpServer;
}

export class McpSseController {
  private readonly server: McpServer;

  private readonly transportsMap: Map<string, SSEServerTransport> = new Map();

  constructor({ server }: Options) {
    this.server = server;

    this.getSse = this.getSse.bind(this);
    this.postMessages = this.postMessages.bind(this);
  }

  public async getSse(req: Request, res: Response): Promise<void> {
    const transport = new SSEServerTransport('/messages', res);

    this.transportsMap.set(transport.sessionId, transport);

    res.on('close', () => {
      this.transportsMap.delete(transport.sessionId);
    });

    await this.server.connect(transport);
  }

  public async postMessages(req: Request, res: Response): Promise<void> {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).send('Session ID missing');
      return;
    }

    const transport = this.transportsMap.get(sessionId);

    if (!transport) {
      res.status(400).send(`Transport not found for session ID ${sessionId}`);
      return;
    }

    await transport.handlePostMessage(req, res);
  }
}
