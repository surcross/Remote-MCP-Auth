# Remote MCP Auth

Proof of concept project implementing
[Remote MCP Authorization](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization) for Claude.

## Quick Start

### AWS

1. Deploy `infrastructure/cloudformation.json` template.
2. Note `ApiUrl` from "Outputs" tab (`https://abc123.execute-api.us-east-1.amazonaws.com`).
3. Go to `oauth-function`, upload files from `oauth-funtion/src` (except `__fixtures__`). Note the source files are
   using `.mjs` extension, not `.js`. You can also use `npm run package` command to prepare zip for uploading through
   the AWS console.
4. Deploy the `oauth-function` with updated source code.

### API

Endpoints deployed, optionally test with Postman:

* `GET https://abc123.execute-api.us-east-1.amazonaws.com/`
* `GET https://abc123.execute-api.us-east-1.amazonaws.com/.well-known/oauth-authorization-server`
* `POST https://abc123.execute-api.us-east-1.amazonaws.com/oauth/register`
* `GET https://abc123.execute-api.us-east-1.amazonaws.com/oauth/authorize`
* `POST https://abc123.execute-api.us-east-1.amazonaws.com/oauth/authorize`
* `POST https://abc123.execute-api.us-east-1.amazonaws.com/oauth/token`

You can find the exact query string parameters and payloads sent by Claude for each request in
`oauth-funtion/src/__fixtures__`.

### Claude

1. Open "Settings" -> "Integrations" in Claude, click on "Add integraton".
2. Enter integration name, paste integration URL (`https://abc123.execute-api.us-east-1.amazonaws.com`) and click on
   "Add".
3. Click on "Connect", this will redirect to the authorization page provided by the **OAuth Function**.
4. Click "Authorize", this will redirect back to Claude.
5. Claude should confirm successful connection (even if the actual MCP server is not yet implemented).

## Flow

When user clicks on "Connect" button in Claude the following sequence happens:

1. Claude requests `GET /.well-known/oauth-authorization-server`
2. Claude requests `POST /oauth/register`
3. Claude redirects user to `GET /oauth/authorize`, the application renders with the web page
4. User clicks "Authorize", the web page submits form to `POST /oauth/authorize`
5. After form is submitted, `POST /oauth/authorize` redirects user back to Claude
6. Claude requests `GET /.well-known/oauth-authorization-server` again
7. Claude requests `POST /oauth/token`
8. Claude requests `GET /` with headers `Accept: text/event-stream` and `Authorization: Bearer ACCESS_TOKEN`
9. And confirms successful connection: "Successfully connected to server".

Notes:

* Authorization page flow - the web page implementation served under `GET /oauth/authorize` - is an implementation
  detail, not standardized, as well as the endpoint `POST /oauth/authorize` itself and it's implementation, since it's
  used by that web page only.

Test: `npx @modelcontextprotocol/inspector@0.13` (using older version)

## Google Cloud Run

Create project
Create repository in Artifact Registry
Create Docker image and push to AR 

```sh
docker build -t mcp-server .
docker tag mcp-server us-west1-docker.pkg.dev/project/repo/mcp-server
docker push us-west1-docker.pkg.dev/project/repo/mcp-server
```

Deploy image to Cloud Run, require no authentication, configure max possible timeout (3600 seconds).

Add env vars:
ACCESS_TOKEN_SECRET
OAUTH_API_BASE_URL
