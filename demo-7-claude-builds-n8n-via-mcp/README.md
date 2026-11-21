# Demo 7 — Claude builds n8n workflows through n8n's MCP server

**Wrap-up / Module 4 (optional) · ~8 minutes · slide 34 panel 3: "n8n's control plane as tools"**

All day n8n *used* MCP. Here it's the other way round: n8n's **instance-level MCP server** exposes n8n itself (search, create, update, run workflows) as tools, and Claude Code or Cursor drives it by prompt. This folder has no workflow JSON on purpose: the agent builds them live from the prompts in `prompts/`.

```
Claude Code / Cursor ──MCP──► n8n instance MCP server ──► creates & tests workflows in your n8n
```

## Setup (once, ~3 minutes)

1. n8n is running (`cd n8n && docker compose up -d`) and the credentials `OpenRouter` and `ops-mcp token` exist (`n8n/README.md`).
2. In n8n open **Settings → n8n MCP** (instance-level MCP), turn it on, and copy the **server URL** and **access token** it shows. The URL looks like `http://localhost:5678/mcp-server/http`.
3. Connect Claude Code (from the repo root):
   ```bash
   claude mcp add --transport http n8n-instance http://localhost:5678/mcp-server/http \
     --header "Authorization: Bearer <token from n8n>"
   claude          # then  /mcp  → n8n-instance should be connected
   ```
   Cursor alternative: add to `.cursor/mcp.json`:
   ```json
   "n8n-instance": { "url": "http://localhost:5678/mcp-server/http", "headers": { "Authorization": "Bearer ${env:N8N_MCP_TOKEN}" } }
   ```
4. Check: ask *"Which tools do you have from n8n-instance?"* You should see tools for searching, creating and running workflows. Tool names differ between n8n versions, so the prompts below describe *what* to do rather than naming tools.

## Run the demo

Paste the prompts from `prompts/` into Claude Code, in order:

| Prompt | What happens | Time |
| --- | --- | --- |
| [`01-explore.md`](prompts/01-explore.md) | Read-only warm-up: Claude lists and explains your existing workflows | 1 min |
| [`02-build-lab-c-triage.md`](prompts/02-build-lab-c-triage.md) | Claude builds the Ex 8 / Lab C classifier workflow from a description | 3 min |
| [`03-build-daily-digest.md`](prompts/03-build-daily-digest.md) | A different shape: a Schedule trigger + Data Table + Claude summary | 3 min |
| [`04-review-lab-d.md`](prompts/04-review-lab-d.md) | Claude reviews your Lab D workflow with the `n8n-workflow-review` skill (read-only) | 2 min |

After each build: open the new workflow in the n8n editor, show it on screen, and run it with the test URL. **Every prompt tells Claude not to publish**, so a human reviews first.

## Talking points

- **MCP works in both directions:** n8n as a client (Ex 10), n8n as a server for one workflow (bonus), and here n8n's whole control plane as a server.
- **Same safety rules apply to the builder:** draft only, existing credentials by name, no secrets in prompts, and a human publishes.
- **Compare with Demo 8 (n8n Assistant):** same goal, but there the agent lives *inside* n8n. Here your own coding agent, with your repo and your skills, does the building.

## If it fails

| Symptom | Fix |
| --- | --- |
| `n8n-instance` not connected | MCP not enabled in n8n Settings, or wrong token |
| Workflow created but credential nodes show red | The agent didn't find the credential. Say its exact name (`OpenRouter`), or select it by hand |
| The agent tries to publish | Stop it, and remind it of the "do not publish" rule. It's also a good moment for the room |
