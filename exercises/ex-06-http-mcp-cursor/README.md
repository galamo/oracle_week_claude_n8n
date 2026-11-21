# Exercise 6 — Connect a remote MCP server over Streamable HTTP

**Module 3 · 12 minutes · Lab B part 2 · slides 21, 22, 25**

## Goal

Connect Cursor (or Claude Code) to our **ops MCP server**, a separate long-running process on `http://localhost:3200/mcp` protected by a bearer token, and call its tools by prompt.

## Steps

1. Start the server and leave this terminal open:
   ```bash
   cd demo-5-ops-mcp-server
   npm install      # first time only
   npm start
   ```
2. Check it without an LLM:
   ```bash
   npm test         # in a second terminal: lists the 4 tools and calls get_order 1042
   ```
3. Add the server to **Cursor**: in `.cursor/mcp.json` in the repo root, add an `ops-mcp` entry with `url` and an `Authorization` header that uses your `MCP_TOKEN`. Don't paste the token into the file. Start Cursor from a terminal where the variable is set:
   ```bash
   set -a; source .env; set +a; cursor .
   ```
   *Alternative:* Claude Code: `claude mcp add --transport http ops-mcp http://localhost:3200/mcp --header "Authorization: Bearer $MCP_TOKEN"`
4. In Cursor Agent mode (or Claude Code), ask:
   - *"Look up customer dana.cohen@example.com and her order 1042. Can she keep the blender if she gets a refund?"*
5. Watch the **server terminal** while Claude works: each tool call appears in the log.

## Done when

- The tool calls (`lookup_customer`, `get_order`, `search_kb`) appear in Cursor's tool log **and** in the server log.
- The answer cites the policy: the item is over 200 ILS, so it's a return label, not keeping it.
- You can say what happens if the token is wrong (try it).
