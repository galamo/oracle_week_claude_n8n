# Agentic Automation — Claude, MCP & n8n

Seminar repo for **"Agentic Automation: Claude, MCP & n8n in Practice"**. Claude is called through **OpenRouter** (except Demo 9, which needs a direct Anthropic key).

| Area | Path | What it is |
| --- | --- | --- |
| **Demos** | `demo-1` … `demo-9` | Live stage scripts and host-app walkthroughs |
| **Exercises** | [`exercises/`](exercises/) | Labs A–D (0–12 + bonus) |
| **Flows** | [`Flows/`](Flows/) | Nine animated HTML explainers (open [`Flows/index.html`](Flows/index.html)) |
| **n8n** | [`n8n/`](n8n/) | Local Docker n8n for Ex 8–12 |
| **Prompts / skills** | [`prompts/`](prompts/), [`skills/`](skills/) | Runtime + build prompts, agent rules |

---

## Demos

| Demo | Module | What it shows | Needs |
| --- | --- | --- | --- |
| [demo-1-deterministic-vs-agentic](demo-1-deterministic-vs-agentic/) | M1 | Keyword rules vs Claude on the same 8 requests | OpenRouter |
| [demo-2-structured-output](demo-2-structured-output/) | M2 | Free text → JSON-in-prompt → structured outputs into a Switch | OpenRouter |
| [demo-3-tool-call-loop](demo-3-tool-call-loop/) | M2 | Tool-use loop by hand: Claude asks, your code runs the tool | OpenRouter |
| [demo-4-connect-mcp-servers](demo-4-connect-mcp-servers/) | M3 | Filesystem MCP (stdio) + ops-mcp (HTTP) in Desktop / Cursor / Inspector | Demo 5 running |
| [demo-5-ops-mcp-server](demo-5-ops-mcp-server/) | M3–M5 | Our MCP server: 4 tools over Streamable HTTP, auth, both protocol eras | `npm install` |
| [demo-7-claude-builds-n8n-via-mcp](demo-7-claude-builds-n8n-via-mcp/) | Wrap-up | Claude Code builds/reviews n8n workflows via n8n’s instance MCP (prompts) | n8n + Claude Code |
| [demo-8-n8n-assistant](demo-8-n8n-assistant/) | Lunch / M4 | n8n Assistant builds a workflow from a goal (prompts) | Assistant-enabled n8n |
| [demo-9-mcp-connector-api](demo-9-mcp-connector-api/) | M3 (opt.) | One Anthropic Messages call with `mcp_servers` — Anthropic calls ops-mcp through a tunnel | Anthropic key + tunnel |

There is no `demo-6` in this repo.

**Day order (live):** M1 → Demo 1 · M2 → Demo 2 then Demo 3 · M3 → start Demo 5, then Demo 4 (Inspector → Desktop → Cursor) · optional Demo 9 with tunnel.

---

## Exercises

Full checklist: [`exercises/README.md`](exercises/README.md). Solutions live in `solutions/` (lecturer only, git-ignored).

| Lab | Exercises | Focus |
| --- | --- | --- |
| Opening | [0](exercises/ex-00-environment-check/) | Environment check (Docker, Node, OpenRouter) |
| — | [1](exercises/ex-01-agentic-fit/) | Agentic or not? (pen & paper) |
| **A** (M2) | [2](exercises/ex-02-classifier-schema/), [3](exercises/ex-03-refusal-path/) | Classifier JSON Schema + refusal path |
| — | [4](exercises/ex-04-tool-definition/) | Define a tool, read the `tool_use` |
| **B** (M3) | [5](exercises/ex-05-filesystem-mcp/), [6](exercises/ex-06-http-mcp-cursor/), [7](exercises/ex-07-add-mcp-tool/) | stdio MCP → HTTP ops-mcp → add a tool |
| **C** (M4) | [8](exercises/ex-08-webhook-classify/), [9](exercises/ex-09-expressions/), [★ bonus](exercises/bonus-n8n-as-mcp-server/) | Webhook → Claude → Respond; expressions; n8n as MCP server |
| **D** (M5) | [10](exercises/ex-10-agent-mcp/), [11](exercises/ex-11-lab-d-full-triage/), [12](exercises/ex-12-unhappy-path/) | Agent + MCP → full triage with HITL → retries & error workflow |

Ex 8–12 and the bonus need n8n: see [`n8n/README.md`](n8n/README.md). Ex 10–12 also need `demo-5-ops-mcp-server` running (`http://host.docker.internal:3200/mcp` from inside Docker).

---

## Flows

Animated stage walkthroughs — open [`Flows/index.html`](Flows/index.html) in a browser (or any `F*.html` directly). Freeze a phase with `?at=<phaseKey>`; F5 also accepts `?mode=session` or `?mode=stateless`.

| Flow | Module | Idea | Pairs with |
| --- | --- | --- | --- |
| [F1](Flows/F1-deterministic-vs-agentic.html) | M1 | Same request: fixed Switch vs Claude choosing a path | Demo 1, Ex 1 |
| [F2](Flows/F2-three-layer-architecture.html) | M1 | Trigger → Claude → MCP tools → write-back | Architecture slide |
| [F3](Flows/F3-claude-tool-call-loop.html) | M2 | `tool_use` → your code → `tool_result` → `end_turn` | Demo 3, Ex 4 |
| [F4](Flows/F4-structured-output-contract.html) | M2 | Free text vs schema JSON feeding a Switch | Demo 2, Lab A |
| [F5](Flows/F5-mcp-session-vs-stateless.html) | M3 | Session handshake vs 2026-07-28 stateless headers | Demo 5 |
| [F6](Flows/F6-stdio-vs-streamable-http.html) | M3 | Local stdio pipe vs remote `/mcp` (n8n needs HTTP) | Demo 4, Lab B |
| [F7](Flows/F7-n8n-items-and-expressions.html) | M4 | Items + `{{ $json }}` — every node once per item | Ex 9 |
| [F8](Flows/F8-end-to-end-triage-hitl.html) | M5 | Branch, approval wait, retries, error workflow | Lab D / Ex 11–12 |
| [F9](Flows/F9-three-mcp-surfaces-n8n.html) | M5 | n8n Client Tool, Server Trigger, instance MCP | Demo 7, bonus |

Source prompts that generate these pages: [`prompts/flows/`](prompts/flows/).

---

## One-time setup

```bash
cp .env.example .env          # OPENROUTER_API_KEY + MCP_TOKEN (long random string)
node -v                       # 22+
cd demo-5-ops-mcp-server && npm install && cd ..
# for Ex 8–12:
# cd n8n && docker compose up -d
```

Demos 1–3 have no `npm install`. Demo 4 uses `npx` (caches on first online run). Demo 9 also needs `ANTHROPIC_API_KEY`, `MCP_PUBLIC_URL` (Cloudflare tunnel to ops-mcp), and `MCP_ALLOWED_HOSTS` including `.trycloudflare.com`.

**Offline backup:** Demo 1 — `npm run record` then `npm run demo:offline`. Demos 4–5 work offline once packages are cached (LLM in the host app still needs network).

---

## Other folders

| Path | Notes |
| --- | --- |
| [`shared/openrouter.js`](shared/openrouter.js) | Tiny OpenRouter client for demos 1–3 |
| [`material/`](material/) | Extra n8n/MCP lab stack (compose, seed workflows, form lab) — separate from the seminar demos |
| [`prompts/`](prompts/README.md) | Runtime, build, flow, and rules prompts |
| [`skills/`](skills/README.md) | Claude skills used in the seminar |

Default models in `.env`: `anthropic/claude-haiku-5.5` (classify) and `anthropic/claude-sonnet-5.5` (agent). Confirm IDs at https://openrouter.ai/models.
