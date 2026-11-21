#!/usr/bin/env bash
# Copy the Cursor MCP config into the repo root as .cursor/mcp.json (project-level).
# Cursor reads MCP_TOKEN from the environment it was started from, so launch Cursor from a shell
# where you ran:  set -a; source .env; set +a
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
mkdir -p "$ROOT/.cursor"
if [ -f "$ROOT/.cursor/mcp.json" ]; then
  echo "$ROOT/.cursor/mcp.json already exists — merge configs/cursor-mcp.json into it by hand."; exit 1
fi
cp "$(dirname "$0")/../configs/cursor-mcp.json" "$ROOT/.cursor/mcp.json"
echo "Wrote $ROOT/.cursor/mcp.json — open $ROOT in Cursor, then Settings → MCP to enable the servers."
