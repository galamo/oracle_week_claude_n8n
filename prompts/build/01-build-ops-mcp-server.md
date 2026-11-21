# B1 — Prompt: build the ops MCP server (Claude Code / Cursor)

**Used in:** Module 3, as a live "build an MCP server by prompt" demo. The result should look like `demo-5-ops-mcp-server/`.
**Updated after building:** the MCP TypeScript SDK v2 is split into packages (`@modelcontextprotocol/server`, `/node`, `/client`), and `createMcpHandler()` serves 2026-07-28 and 2025 clients from one endpoint.

```text
Create a Node.js 24 project "ops-mcp" (plain ES modules JavaScript, no build step) that runs an MCP server over
Streamable HTTP on port 3200 at /mcp.

Use the MCP TypeScript SDK v2 packages: @modelcontextprotocol/server (McpServer, createMcpHandler) and
@modelcontextprotocol/node (toNodeHandler), with Express 5 and zod 4. Serve the 2026-07-28 stateless protocol and
keep the stateless legacy fallback for 2025-era clients (createMcpHandler option legacy: 'stateless'), so Cursor,
Claude Code, Claude Desktop (via mcp-remote), n8n and MCP Inspector all work.

Tools (zod input schemas, return JSON as text content AND structuredContent):
- lookup_customer({ email? | customer_id? })  read-only
- get_order({ order_id })                      read-only, order_id is 4–8 digits
- search_kb({ query, category? })              read-only, max 3 articles
- create_ticket({ customer_id, category, priority, summary, order_id? })  WRITE — the description must say
  "requires human approval"; append to data/tickets.json
Write every description as a prompt: when to use it, what it returns, side effects, the not-found case.
Mark read tools with annotations.readOnlyHint = true.

Data: ./data/customers.json (20), orders.json (40, include order 1042 = Blender Pro 900, 349 ILS, delivered),
kb.json (15 policy articles incl. refunds, keeping damaged items only under 200 ILS, SLA by tier), tickets.json ([]).
All fictional.

Security: require Authorization: Bearer <MCP_TOKEN> from the repo-root .env (401 otherwise); allow only Host
headers localhost, 127.0.0.1 and host.docker.internal (403 otherwise). No tool may run shell commands, SQL, or read
files outside ./data.

Log one line per request: method (from the Mcp-Method header or the JSON-RPC body), tool name (Mcp-Name or
params.name), and the protocol version header, so the audience can see 2025 vs 2026 clients.

Add npm scripts start, dev (node --watch), test (official @modelcontextprotocol/client: list tools, call each read
tool), test:modern (same with versionNegotiation mode 'auto'), inspector, reset-tickets, and a README with the
Cursor, Claude Code, Claude Desktop and n8n connection snippets.
```
