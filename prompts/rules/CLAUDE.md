# CLAUDE.md — Agentic Automation seminar repo

Copy this file to the repo root as `CLAUDE.md` (Claude Code reads it automatically).

## What this repo is
Live demos, exercises and solutions for the seminar "Agentic Automation: Claude, MCP & n8n in Practice".
Claude is called through OpenRouter (OpenAI-compatible Chat Completions API).

## Folder map
- `demo-1…5-*/`  — live demos (Node, no deps except demo-5)
- `demo-5-ops-mcp-server/` — the ops MCP server (Streamable HTTP, port 3200, SDK v2)
- `exercises/` — student instructions + starters · `solutions/` — lecturer only, git-ignored
- `n8n/` — docker-compose for local n8n + setup guide
- `prompts/` — runtime, build, flow and rule prompts · `skills/` — Claude skills
- `shared/openrouter.js` — tiny OpenRouter client · `.env` — all secrets (never commit)

## Commands
- MCP server: `cd demo-5-ops-mcp-server && npm start` · test: `npm test` / `npm run test:modern` · `npm run inspector`
- n8n: `cd n8n && docker compose up -d` → http://localhost:5678
- Environment check: `node exercises/ex-00-environment-check/check.js`

## Conventions
- ES modules, Node ≥ 22, no build step. Demos 1–3 must stay dependency-free.
- Every MCP tool: snake_case name, description = when to use + returns + side effects + failure case, zod input schema.
- Tools return JSON (text content + structuredContent), never prose. Errors return `{ error, hint }` / `isError`.
- Structured outputs: JSON Schema with `additionalProperties: false`, all fields in `required`, no `minimum`/`maximum`.
- n8n: after a Wait node use `$('Node').first()`, not `.item`.

## Safety rules
- No shell / exec / SQL tools; no file access outside `data/` folders.
- No secrets in code, workflow JSON or logs — use `.env` and n8n credentials.
- Write tools must say "requires human approval"; agents get read tools only.
- Never commit `.env` or `solutions/`.

## Definition of done
Inspector lists the tools · `npm test` passes · the n8n workflow runs green · `check.js` is all ✔.
