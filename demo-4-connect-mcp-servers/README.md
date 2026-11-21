# Demo 4 — Connect MCP servers to Claude (stdio + HTTP)

**Module 3 · ~10 minutes · slides 21 "Two transports" and 25 "Install and connect" · the base for Lab B**

The same idea, two transports:

| Server | Transport | Who starts it | What it shows |
| --- | --- | --- | --- |
| `demo-filesystem` (the official `@modelcontextprotocol/server-filesystem`) | **stdio** | The host launches it as a child process | Installing an *existing* server in one config block, and least privilege (one folder only) |
| `ops-mcp` (our Demo 5) | **Streamable HTTP** | You run it (`npm start`); hosts connect to a URL | A shared, remote-style server with auth, the kind n8n can use |

No LLM key needed here: the hosts (Claude Desktop, Cursor, Claude Code) bring their own model.

## Folders

```
demo-data/     what Claude MAY read: a policy, stand-up notes, a refunds CSV
private/       what Claude must NOT read (fake salaries). It sits next to demo-data/ on purpose
configs/       ready-made configs for Claude Desktop and Cursor
scripts/       MCP Inspector launchers + installers for Cursor / Claude Code
```

## Step by step

### 1. Look at a server without any LLM: MCP Inspector

```bash
cd demo-4-connect-mcp-servers
npm run inspector:fs        # Inspector starts the filesystem server over stdio
```

In the Inspector, open **Tools**, run `list_allowed_directories` (it shows only `demo-data`), then run `read_text_file` on the policy. *"This is what Claude will see: a list of tools with schemas. Nothing magic."*

For the HTTP server, start Demo 5 first (`cd ../demo-5-ops-mcp-server && npm start`) and run:

```bash
npm run inspector:ops       # choose Streamable HTTP, URL http://localhost:3200/mcp, header Authorization: Bearer <MCP_TOKEN>
```

### 2. Claude Desktop (stdio, plus HTTP through `mcp-remote`)

Claude Desktop → Settings → Developer → **Edit Config** opens `~/Library/Application Support/Claude/claude_desktop_config.json`. Merge in `configs/claude_desktop_config.json`, replace `PASTE_YOUR_MCP_TOKEN_HERE` with your `MCP_TOKEN`, and restart Claude Desktop.

Prompts to try:
- *"Summarize the files you can access and list the action items from the stand-up notes."*
- *"From refunds-by-week.csv, which week had the most rejections?"*
- *"Read ../private/salaries-DO-NOT-SHARE.csv."* The server refuses because it's outside the allowed folder. **This is the least-privilege moment.**
- *"Look up order 1042 and tell me if the customer can keep the item."* This uses ops-mcp: `get_order` + `search_kb` → KB-03.

`mcp-remote` is a small bridge. Claude Desktop launches it over stdio and it talks HTTP to our server. A local HTTP server needs it because Claude Desktop's built-in remote connectors expect a public HTTPS URL.

### 3. Cursor (both servers natively)

```bash
npm run cursor:install      # writes ../.cursor/mcp.json (repo root) from configs/cursor-mcp.json
```

Start Cursor from a terminal where `MCP_TOKEN` is set (`set -a; source ../.env; set +a; cursor ..`). Then open Cursor Settings → MCP and enable both servers. Ask the same prompts in Agent mode and open the tool-call log to show the calls.

### 4. Claude Code

```bash
npm run claude-code:add     # adds both servers with --scope local; the repo's .mcp.json (oci-api) is not touched
claude                      # then:  /mcp   to see them connected
```

## Talking points

- **One config block = one integration.** The filesystem server took 5 lines of JSON. Nobody wrote code.
- **stdio vs HTTP:** the filesystem server dies when Claude Desktop closes. ops-mcp keeps running, and Cursor, Claude Code and n8n can all share it.
- **Scope it:** the filesystem server gets one folder, not `~`. Ask the room what happens if you give it your home folder.
- **Read the tool list before you trust a server:** the "filesystem" server also has `write_file`, `edit_file` and `move_file`. Turn those tools off in Cursor's MCP settings, or deny them when Claude Desktop asks for permission. Read-only first.
- **Tokens stay out of git:** configs use `${env:MCP_TOKEN}` or a placeholder, and `.env` is in `.gitignore`.

## Troubleshooting

- **Claude Desktop shows "server disconnected":** `npx` may not be on the PATH that Claude Desktop sees (common with nvm). Use the full path from `which npx` as `command`.
- **ops-mcp 401:** the token in the header doesn't match `MCP_TOKEN` in `.env`.
- **ops-mcp 403 "Host not allowed":** use `localhost`, not your machine's IP, or add the host to `MCP_ALLOWED_HOSTS`.
