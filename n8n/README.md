# n8n for the seminar

Exercises 8–12, the bonus and Labs C and D run on a local n8n in Docker. All workflows in this repo were imported and **executed end to end on n8n 2.48.7** before the seminar.

## 1. Start n8n (once)

```bash
cd n8n
docker compose up -d          # first start downloads the image (1–2 min)
docker compose logs -f n8n    # wait for "Editor is now accessible via: http://localhost:5678"
```

Open http://localhost:5678 and create your local owner account (any email and password, it stays on your laptop).

## 2. Create two credentials (once)

**Overview → Credentials → Create credential:**

| Name (use exactly this) | Type | Value |
| --- | --- | --- |
| `OpenRouter` | **OpenRouter** | API Key = your `OPENROUTER_API_KEY` (leave the base URL as is) |
| `ops-mcp token` | **Bearer Auth** | Token = your `MCP_TOKEN` from `.env` |

`OpenRouter` is used twice: by the HTTP Request node that classifies, and by the OpenRouter Chat Model inside the agents.
`ops-mcp token` is used to call our MCP server (Ex 10–12), and to protect n8n's own MCP server (bonus).

## 3. Create two Data Tables (once, before Ex 11)

**Overview → Data tables → Create:**

| Table | Columns (name · type) |
| --- | --- |
| `triage_log` | `request_text` · string, `email` · string, `category` · string, `priority` · string, `confidence` · **number**, `status` · string, `ticket_id` · string, `note` · string |
| `alerts` | `workflow` · string, `node` · string, `message` · string, `execution_id` · string, `url` · string |

## 4. Import a workflow

**Workflows → ⋯ (top right) → Import from File** → pick a `*.workflow.json`. After importing:

1. Open each node with a red warning and **select the credential** (`OpenRouter` or `ops-mcp token`). Exported files never contain your secrets.
2. For **Data Table** nodes, select the table (`triage_log` / `alerts`).
3. **Publish** the workflow (top right) to use the production URL `http://localhost:5678/webhook/<path>`. While building, use **Execute workflow** and the test URL `http://localhost:5678/webhook-test/<path>`.

Lecturer shortcut: import every solution at once from the CLI. The repo is mounted at `/repo` in the container.

```bash
docker compose exec n8n n8n import:workflow --separate --input=/repo/solutions/ex-11-lab-d-full-triage/
```

## 5. The ops MCP server must be running for Ex 10–12

```bash
cd demo-5-ops-mcp-server && npm start
```

Inside the n8n container, your laptop is `host.docker.internal`, so the MCP endpoint in n8n is **`http://host.docker.internal:3200/mcp`**, not `localhost`.

## Things that surprised us while testing (tell the students)

- **MCP tool names get a prefix inside the agent.** The MCP Client Tool node renames `get_order` to `ops_mcp__read_tools__get_order` (node name + tool). That's harmless, but you'll see it in the logs.
- **After a Wait node, use `$('Node').first()`, not `$('Node').item`.** Item pairing is lost when an execution pauses and resumes, so `.item` returns nothing. The MCP server's input validation caught it: `create_ticket` was called with empty arguments and refused.
- **The error workflow must be published too.** Otherwise the log says *"Error workflow … is not active and cannot be executed"* and no alert is sent.
- **n8n's own MCP Server Trigger is session-based** (protocol 2025-06-18, `mcp-session-id`), while our ops-mcp server is stateless (2026-07-28). Clients handle both, which makes a nice live example for slide 22.

## Regenerating the workflow files (lecturer)

`solutions/_tools/generate-workflows.py` builds every workflow JSON (starts and solutions) from one source: prompt, schema and node versions. Run it only if you change the prompt or the schema.
