# Demo 5 — Ops MCP server (Streamable HTTP)

**Module 3 → 5 · the server Labs B, C and D use**

A real MCP server in about 150 lines. It gives Claude (or Cursor, or n8n) four tools over one HTTP endpoint, `http://localhost:3200/mcp`:

| Tool | Type | What it does |
| --- | --- | --- |
| `lookup_customer` | read | Find a customer by email or id (`C-1001`) |
| `get_order` | read | Get one order by number (`1042` is the broken blender from the slides) |
| `search_kb` | read | Search the support policy (refunds, shipping, escalation…) |
| `create_ticket` | **write** | Create a ticket in `data/tickets.json`. Its description says it needs human approval |

All data is fictional: 20 customers, 40 orders and 15 policy articles in `data/`.

Built on the **MCP TypeScript SDK v2** (`@modelcontextprotocol/server`), which implements the **2026-07-28 stateless spec**. The server also answers older 2025-era clients. Watch the server log while you connect different clients, and you'll see both eras side by side:

```
20:11:34 POST /mcp  initialize                        [legacy]       ← 2025 client: handshake first
20:11:34 POST /mcp  tools/call       get_order        [2025-11-25]
20:11:49 POST /mcp  server/discover                   [2026-07-28]   ← 2026 client: no handshake, no session
20:11:49 POST /mcp  tools/call       get_order        [2026-07-28]   ← Mcp-Method / Mcp-Name headers
```

## Run it

```bash
# once, in the repo root: cp .env.example .env  → set MCP_TOKEN to a long random string
cd demo-5-ops-mcp-server
npm install
npm start                 # ops-mcp listening on http://localhost:3200/mcp
```

In a second terminal:

```bash
npm test                  # connect like a 2025 client (initialize handshake)
npm run test:modern       # connect with 2026-07-28 negotiation (server/discover, stateless)
npm run inspector         # MCP Inspector UI
npm run reset-tickets     # empty data/tickets.json between runs
```

**MCP Inspector:** pick transport **Streamable HTTP**, URL `http://localhost:3200/mcp`, and add the header `Authorization: Bearer <MCP_TOKEN>`. Then connect, open Tools, and run `get_order` with `1042`. No LLM is involved, so this is the cleanest way to show what a tool really is.

## Connect it to hosts

**Cursor** — `.cursor/mcp.json` in your project (ready-made in `../demo-4-connect-mcp-servers/configs/`):

```json
{
  "mcpServers": {
    "ops-mcp": {
      "url": "http://localhost:3200/mcp",
      "headers": { "Authorization": "Bearer ${env:MCP_TOKEN}" }
    }
  }
}
```

**Claude Code:**

```bash
claude mcp add --transport http ops-mcp http://localhost:3200/mcp --header "Authorization: Bearer $MCP_TOKEN"
```

**Claude Desktop:** it starts local servers as processes, so bridge to HTTP with `mcp-remote`. See `../demo-4-connect-mcp-servers/configs/claude_desktop_config.json`.

**n8n in Docker** (Labs C and D): in the MCP Client Tool node, set Endpoint to `http://host.docker.internal:3200/mcp`, transport to HTTP Streamable, and authentication to Bearer with your `MCP_TOKEN`. `localhost` inside the n8n container means the container itself, not your laptop.

## Security choices to point out (slide 26)

- **Bearer token on every request.** No token gets a `401` (try `curl -X POST localhost:3200/mcp`).
- **Host header allow-list** (`localhost`, `127.0.0.1`, `host.docker.internal`). Anything else gets a `403`, which protects against DNS rebinding.
- **Read tools are marked `readOnlyHint`.** The one write tool says it needs approval, and it can't touch anything outside `data/`.
- **No shell, no SQL, no file paths in the tool inputs.** Every input has a strict zod schema (`order_id` must be 4–8 digits).
- **Tool descriptions are prompts.** They say when to use the tool, what it returns, and that "not found" is a real answer, so Claude shouldn't retry with guessed ids. Read them in `src/tools.js`.

## Files

```
src/server.js            Express + createMcpHandler (stateless, legacy fallback) + auth + logging
src/tools.js             the 4 tools: description, zod input schema, handler
scripts/smoke-test.js    official MCP client: list tools, call them (legacy or --modern)
data/*.json              customers, orders, kb, tickets
```

Exercise 7 (add a 5th tool): copy the `get_order` block in `src/tools.js` and write `get_sla_policy({ tier })`, which returns the response time from KB-14. Restart the server and it shows up in `tools/list` and in the Inspector.
