# Demo 9 — Anthropic MCP connector: Claude calls the MCP server itself

**Module 3 (optional) · ~6 minutes · "the third way to use MCP"**

In Demo 3 *our code* ran the tool loop. In Demo 4 a *host app* (Claude Desktop, Cursor) was the MCP client. Here we send **one** request to the Anthropic Messages API with `mcp_servers`, and **Anthropic's side** connects to our MCP server, calls the tools and returns the final answer:

```
your script ──1 request──► Anthropic API ──MCP over HTTPS──► tunnel ──► ops-mcp on your laptop
           ◄── answer + mcp_tool_use / mcp_tool_result blocks ──
```

## What's different here

- **Anthropic API, not OpenRouter.** `mcp_servers` is a feature of Anthropic's Messages API (beta header `mcp-client-2025-11-20`). OpenRouter's OpenAI-compatible API has no such field, so this demo needs an `ANTHROPIC_API_KEY` from console.anthropic.com.
- **The server must be public HTTPS.** Anthropic connects from the internet, so `localhost` won't work. We use a free Cloudflare quick tunnel.

## Run it

1. In the repo-root `.env` add:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-...
   MCP_ALLOWED_HOSTS=localhost,127.0.0.1,host.docker.internal,.trycloudflare.com
   ```
   The leading dot in `.trycloudflare.com` allows any tunnel hostname. Remove it after the demo.
2. Start the MCP server and a tunnel (two terminals):
   ```bash
   cd demo-5-ops-mcp-server && npm start
   cd demo-9-mcp-connector-api && npm run tunnel      # or: brew install cloudflared && cloudflared tunnel --url http://localhost:3200
   ```
   Copy the `https://<random>.trycloudflare.com` URL it prints, and add it to `.env`:
   ```bash
   MCP_PUBLIC_URL=https://<random>.trycloudflare.com/mcp
   ```
3. Run:
   ```bash
   cd demo-9-mcp-connector-api
   npm run demo -- --show-request     # shows mcp_servers + mcp_toolset in the request
   npm run demo
   npm run demo -- --allow-write --question "Create a ticket for order 1042, it arrived broken"
   ```

## What to point at

- **The request** (`--show-request`): `mcp_servers` (URL, name, `authorization_token`) and a `tools` entry of type `mcp_toolset`. No tool definitions written by us; Anthropic reads them from the server.
- **The denylist:** `configs: { create_ticket: { enabled: false } }` keeps the assistant read-only. Run once with `--allow-write` and show the difference. Ask the room whether that's a good idea without a human gate.
- **The ops-mcp terminal:** the `tools/call` lines come from Anthropic's servers through the tunnel, not from your laptop.
- **The response:** `mcp_tool_use` and `mcp_tool_result` blocks sit inside the answer. Compare with Demo 3's `tool_calls` and `role:"tool"` round trips.

## When to use which

| | Your code runs the loop (Demo 3) | Host app (Demo 4) | MCP connector (Demo 9) |
| --- | --- | --- | --- |
| Who is the MCP client | you | Claude Desktop / Cursor / n8n | Anthropic |
| Server location | anywhere | local or remote | **public HTTPS only** |
| Control over each call | full | the host decides | per-tool enable/disable |
| Best for | custom agents | people working interactively | backend features with little code |

## Security notes

- The tunnel exposes your server to the internet. The bearer token and the Host allow-list protect it, but **stop the tunnel after the demo** and remove `.trycloudflare.com` from `MCP_ALLOWED_HOSTS`.
- The token goes to Anthropic as `authorization_token`, so use a demo token, not a real one.
- This feature is a beta and isn't eligible for zero-data-retention.

## Tested

The script was checked against a stub of the Anthropic API: the request shape, the denylist config and the response rendering. It wasn't tested against the live API, because the cloud workspace can't reach it. Run it once tonight with your key.
