# Prompts

Every prompt used or shown in the seminar, in one place. The demos and exercises keep their own copies where code reads them; these files are the reference.

## runtime/ — prompts the automations run with

| File | What | Used in |
| --- | --- | --- |
| [01-triage-classifier.md](runtime/01-triage-classifier.md) | P1: classifier system prompt + output schema | Demos 1–2, Lab A, Ex 8, Lab D |
| [02-triage-agent-readonly.md](runtime/02-triage-agent-readonly.md) | P2a: n8n agent with read-only MCP tools | Ex 10 |
| [03-triage-agent-structured.md](runtime/03-triage-agent-structured.md) | P2b: Lab D agent returning a structured proposal (+ schema) | Ex 11 / Lab D |
| [04-support-agent-demo3.md](runtime/04-support-agent-demo3.md) | Support agent for the hand-written tool loop | Demo 3, Ex 4 |
| [05-tool-description-pattern.md](runtime/05-tool-description-pattern.md) | P3: how to write MCP / function tool descriptions | Module 3, Ex 4, Ex 7 |

## build/ — prompts that make Claude build things

| File | What |
| --- | --- |
| [01-build-ops-mcp-server.md](build/01-build-ops-mcp-server.md) | B1: build the ops MCP server (matches demo-5, SDK v2) |
| [02-build-n8n-workflow-via-mcp.md](build/02-build-n8n-workflow-via-mcp.md) | B2: Claude Code builds the Lab C workflow through n8n's MCP server |

## flows/ — animated HTML explainers (Lab 8 style)

Paste [00-base-prompt.md](flows/00-base-prompt.md) first, then one flow:

| Flow | Topic | Slide |
| --- | --- | --- |
| [F1](flows/F1-deterministic-vs-agentic.md) | Deterministic vs agentic | 5 |
| [F2](flows/F2-three-layer-architecture.md) | Three-layer architecture | 8 |
| [F3](flows/F3-tool-call-loop.md) | Tool-call loop (+ Anthropic/OpenRouter toggle) | 14 |
| [F4](flows/F4-structured-output-contract.md) | Structured output contract | 13 |
| [F5](flows/F5-lab8-v2-session-vs-stateless.md) | Lab 8 v2: MCP session vs stateless | 22 |
| [F6](flows/F6-stdio-vs-streamable-http.md) | stdio vs Streamable HTTP | 21 |
| [F7](flows/F7-n8n-items-and-expressions.md) | n8n items and expressions | 32 |
| [F8](flows/F8-end-to-end-triage-hitl.md) | End-to-end triage with approval and error path | 38–42 |
| [F9](flows/F9-n8n-three-mcp-surfaces.md) | The three MCP surfaces of n8n | 34 |

## rules/ — rules files for coding agents

| File | Copy to |
| --- | --- |
| [CLAUDE.md](rules/CLAUDE.md) | repo root `CLAUDE.md` (Claude Code) |
| [cursor-rule-mcp-server.mdc](rules/cursor-rule-mcp-server.mdc) | `.cursor/rules/mcp-server.mdc` (Cursor) |

Skills live in [`../skills/`](../skills/).
