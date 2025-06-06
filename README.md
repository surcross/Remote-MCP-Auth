# Remote MCP

Proof of concept project implementing
[Remote MCP Authorization](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization) for Claude.

## Quick Start

### AWS

1. Deploy `infrastructure/cloudformation.json` template.
2. Note `ApiUrl` from "Outputs" tab (`https://abc123.execute-api.us-east-1.amazonaws.com`).
3. Go to `oauth-function`, upload files from `oauth-funtion/src` (except `__fixtures__`).
   Note the source files are using `.mjs` extension, not `.js`.
4. Deploy the `oauth-function` with updated source code.

### API

Endpoints deployed, optionally test with Postman:

* `GET https://abc123.execute-api.us-east-1.amazonaws.com/.well-known/oauth-authorization-server`
* `POST https://abc123.execute-api.us-east-1.amazonaws.com/register`
* `GET https://abc123.execute-api.us-east-1.amazonaws.com/authorize`
* `POST https://abc123.execute-api.us-east-1.amazonaws.com/authorize`
* `POST https://abc123.execute-api.us-east-1.amazonaws.com/token`

You can find the exact query string parameters and payloads sent by Claude for each request in
`oauth-funtion/src/__fixtures__`.

### Claude

1. Open "Settings" -> "Integrations" in Claude, click on "Add integraton".
2. Enter integration name and paste integration URL (`https://abc123.execute-api.us-east-1.amazonaws.com`).
3. Click on "Connect", this will redirect to the authorization page provided by the **OAuth Function**.
4. Click "Authorize", this will redirect back to Claude.
5. Claude should confirm successful connection (even if the actual MCP server is not yet implemented).

## Flow

When user clicks on "Connect" button in Claude the following sequence happens:

1. Claude requests `GET /.well-known/oauth-authorization-server`
2. Claude requests `POST /register`
3. Claude requests `GET /authorize`, the application responds with the web page
4. User clicks "Authorize", the web page submits form to `POST /authorize`
5. Claude requests `GET /.well-known/oauth-authorization-server` again
6. Claude requests `POST /token`
7. Claude requests `GET /` with headers `Accept: text/event-stream` and `Authorization: Bearer ACCESS_TOKEN`
8. And confirms successful connection.
