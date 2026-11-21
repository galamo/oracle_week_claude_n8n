#!/usr/bin/env bash
# Register both demo servers in Claude Code for this project (local scope: stored in your
# Claude Code settings, NOT in the repo's .mcp.json — so the existing oci-api entry stays untouched).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
set -a; [ -f "$ROOT/.env" ] && . "$ROOT/.env"; set +a
: "${MCP_TOKEN:?Set MCP_TOKEN in $ROOT/.env}"
cd "$ROOT"
claude mcp add --scope local demo-filesystem -- npx -y @modelcontextprotocol/server-filesystem "$ROOT/demo-4-connect-mcp-servers/demo-data"
claude mcp add --scope local --transport http ops-mcp http://localhost:3200/mcp --header "Authorization: Bearer ${MCP_TOKEN}"
claude mcp list
