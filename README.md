# Agentic Automation seminar — demos, exercises, prompts

Live demos for **"Agentic Automation: Claude, MCP & n8n in Practice"**. Claude is called through **OpenRouter**.

| Demo | Module · slide | What it shows | Needs |
| --- | --- | --- | --- |
| [demo-1-deterministic-vs-agentic](demo-1-deterministic-vs-agentic/) | M1 · slide 5 | Keyword rules vs Claude on the same 8 requests | OpenRouter key |
| [demo-2-structured-output](demo-2-structured-output/) | M2 · slides 12–13 | Free text vs JSON-in-prompt vs structured outputs, feeding a Switch | OpenRouter key |
| [demo-3-tool-call-loop](demo-3-tool-call-loop/) | M2 · slide 14 | The tool-use loop by hand: Claude asks, your code runs the tool | OpenRouter key |
| [demo-4-connect-mcp-servers](demo-4-connect-mcp-servers/) | M3 · slides 21, 25–26 | Filesystem MCP (stdio) + our server (HTTP) in Claude Desktop, Cursor, Claude Code, Inspector | Demo 5 running |
| [demo-5-ops-mcp-server](demo-5-ops-mcp-server/) | M3–M5 · slides 20–24 | Our own MCP server: 4 tools over Streamable HTTP, auth, both protocol eras | `npm install` |
| [demo-7-claude-builds-n8n-via-mcp](demo-7-claude-builds-n8n-via-mcp/) | Wrap-up · slide 34 | Claude Code builds and reviews n8n workflows through n8n's instance MCP server (prompts only) | n8n + Claude Code |
| [demo-8-n8n-assistant](demo-8-n8n-assistant/) | Lunch / M4 | n8n's built-in Assistant builds a workflow from a goal (prompts only) | Assistant-enabled n8n |
| [demo-9-mcp-connector-api](demo-9-mcp-connector-api/) | M3 (optional) | One Anthropic API call with `mcp_servers`: Anthropic calls our MCP server through a tunnel | Anthropic key + tunnel |

## Exercises

13 exercises plus a bonus, covering Labs A–D: see [`exercises/README.md`](exercises/README.md).
Exercises 8–12 and the bonus run in n8n: [`n8n/README.md`](n8n/README.md) (`cd n8n && docker compose up -d`).

Solutions live in `solutions/` (lecturer only, git-ignored). Every n8n solution was imported and executed on n8n 2.48.7 before the seminar.

## Prompts and skills

All prompts (runtime, build, flow animations, rules files) are in [`prompts/`](prompts/README.md), and the Claude skills are in [`skills/`](skills/README.md).

## One-time setup

```bash
cd ~/dev-ai/oracle_week_
cp .env.example .env          # paste OPENROUTER_API_KEY, set MCP_TOKEN to a long random string
node -v                       # 22 or newer
cd demo-5-ops-mcp-server && npm install && cd ..
```

Demos 1–3 have no dependencies, so there's no `npm install`. Demo 4 uses `npx`, which downloads the servers on first run, so **run each demo once tonight while you're online**.

## Order on the day

1. **M1:** `cd demo-1-deterministic-vs-agentic && npm run demo:rules`, then `npm run demo`
2. **M2:** `cd demo-2-structured-output && npm run demo -- --show-request`, then `cd demo-3-tool-call-loop && npm run demo:step`
3. **M3:** `cd demo-5-ops-mcp-server && npm start` (leave it running), then `npm run test` and `npm run test:modern` (the spec-change slide), then Demo 4 with Inspector → Claude Desktop → Cursor

## Backup plan (no Wi-Fi)

- Demo 1: `npm run record` tonight, then `npm run demo:offline` on stage.
- Demos 4–5 work fully offline once `npx` has cached the packages, apart from the LLM inside the host app.

## Shared files

```
.env.example            all settings (OpenRouter key and models, MCP token and port)
shared/openrouter.js    tiny OpenRouter client used by demos 1–3 (no dependencies)
```

Models default to `anthropic/claude-haiku-5.5` (classification) and `anthropic/claude-sonnet-5.5` (agent). Check the exact IDs at https://openrouter.ai/models and change them in `.env` if needed.
