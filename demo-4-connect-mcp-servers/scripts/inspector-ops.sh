#!/usr/bin/env bash
# Open MCP Inspector for the ops MCP server (Streamable HTTP). Start the server first:
#   cd ../demo-5-ops-mcp-server && npm start
# In the Inspector UI choose:  Transport = Streamable HTTP · URL = http://localhost:3200/mcp
#                              Header   = Authorization: Bearer <MCP_TOKEN from the repo-root .env>
set -euo pipefail
curl -sf http://localhost:3200/health >/dev/null || { echo "ops-mcp is not running on :3200 — start it: cd demo-5-ops-mcp-server && npm start"; exit 1; }
npx -y @modelcontextprotocol/inspector
