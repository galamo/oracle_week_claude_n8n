# Exercise 10 — An n8n agent that uses our MCP server

**Module 5 · 15 minutes · Lab D part 1 · slide 34**

## Goal

Give an n8n **AI Agent** the ops MCP server as its toolbox, but only the **read** tools. Then watch it look things up before it answers.

```
Webhook (POST /agent) → AI Agent → Respond
                          ├─ OpenRouter Chat Model
                          └─ MCP Client Tool → http://host.docker.internal:3200/mcp
```

## Before you start

- The ops MCP server is running: `cd demo-5-ops-mcp-server && npm start`
- The credentials `OpenRouter` and `ops-mcp token` exist (`n8n/README.md`)

## Steps

1. Import `start.workflow.json`. The agent has no model and no tools yet.
2. Click **+ Chat Model** under the agent → **OpenRouter Chat Model** → credential `OpenRouter`, model `anthropic/claude-sonnet-5.5`.
3. Click **+ Tool** → **MCP Client Tool**:
   - Endpoint: `http://host.docker.internal:3200/mcp`
   - Server Transport: **HTTP Streamable**
   - Authentication: **Bearer Auth** → `ops-mcp token`
   - Tools to Include: **Selected** → `lookup_customer`, `get_order`, `search_kb`
4. Agent → Options → **System Message**: tell it to check facts with the tools, never invent data, cite the policy, and not promise refunds.
5. Execute the workflow and send:
   ```bash
   curl -X POST http://localhost:5678/webhook-test/agent -H "content-type: application/json" \
     -d '{"text":"My order 1042 arrived broken. Can I keep the blender if I get a refund? I am dana.cohen@example.com"}'
   ```
6. Watch the **ops MCP server terminal**: you should see `tools/call` lines.

## Done when

- The server log shows `tools/call lookup_customer`, `get_order` and `search_kb`.
- The answer says she gets a return label, because the item is over 200 ILS (KB-03), and doesn't make it up.
- `create_ticket` is **not** available to the agent. Check the tool list in the agent's execution log.

## Think about

Why did we hide `create_ticket` from the agent? Where should a write happen instead? (Exercise 11.)
