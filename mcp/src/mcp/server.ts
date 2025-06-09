import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const server = new McpServer({
  name: 'example-server',
  version: '1.0.0'
});

server.tool(
  'hello-world',
  () => {
    return {
      content: [
        {
          type: 'text',
          text: 'Hello, world!',
        },
      ],
    };
  }
);
