# Exercise 5 — Connect an existing MCP server (stdio), scoped to one folder

**Module 3 · 10 minutes · Lab B part 1 · slides 21 and 25**

## Goal

Install the official **filesystem MCP server** in your host (Claude Desktop or Cursor) so Claude can read *one* folder and nothing else. No code, just configuration.

## Steps

1. Look at the server before you trust it, using MCP Inspector:
   ```bash
   cd demo-4-connect-mcp-servers
   npm run inspector:fs
   ```
   Open **Tools** and write down which tools it has. Are they all read-only?
2. Add the server to your host:
   - **Claude Desktop:** Settings → Developer → Edit Config. Add a `demo-filesystem` server that runs `npx -y @modelcontextprotocol/server-filesystem <ABSOLUTE path to demo-4-connect-mcp-servers/demo-data>`. Restart Claude Desktop.
   - **Cursor:** add the same server to `.cursor/mcp.json` in the repo root, using `${workspaceFolder}` for the path. Enable it in Settings → MCP.
3. Ask Claude:
   - *"Which folders can you access? List the files."*
   - *"What are the action items in the stand-up notes, and who owns them?"*
   - *"Read ../private/salaries-DO-NOT-SHARE.csv"*

## Done when

- Claude lists only the files in `demo-data/` and answers the action-items question.
- Claude **cannot** read the file in `private/`.
- You can name at least one tool on this server that you'd turn off, and why.

## Hint

If Claude Desktop says the server failed to start, `npx` may not be on its PATH. Run `which npx` and use the full path as `command`.
