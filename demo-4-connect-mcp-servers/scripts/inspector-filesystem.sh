#!/usr/bin/env bash
# Open MCP Inspector on the filesystem server (stdio), scoped to demo-data/ only.
# The Inspector launches the server as a child process — exactly what Claude Desktop does.
set -euo pipefail
cd "$(dirname "$0")/.."
npx -y @modelcontextprotocol/inspector npx -y @modelcontextprotocol/server-filesystem "$(pwd)/demo-data"
