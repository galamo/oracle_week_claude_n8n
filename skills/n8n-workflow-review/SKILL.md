---
name: n8n-workflow-review
description: Review an exported n8n workflow JSON for security, reliability, cost and agent-safety problems and return a scored checklist with the top fixes. Use when the user asks to review, audit or check an n8n workflow, or shares a workflow .json export.
---

# n8n workflow review

Review one exported n8n workflow (the JSON from *Download* / *Export*, or a `*.workflow.json` file) and produce a scored checklist plus the three most important fixes.

## Steps

1. **Load the workflow.** Read the JSON. Build a map of `nodes` (name → type, typeVersion, parameters, credentials, settings such as `retryOnFail`, `disabled`) and of `connections` (main and `ai_*` links). Note `settings.errorWorkflow`.
2. **Identify the shape:** trigger type(s), AI nodes (agent, chat model, MCP Client Tool, output parser), external calls (HTTP Request, MCP Client, app nodes), write actions (create/update/delete/send/insert), human-in-the-loop nodes (Wait with form/webhook resume, send-and-wait, tool approval).
3. **Run every check below.** For each one record PASS / FAIL / N/A and one line of evidence that names the node.
4. **Score:** PASS = 1, FAIL = 0, N/A is skipped. Report `score / applicable`.
5. **Output** in the format at the end. Keep it short. Name nodes exactly as they appear in the workflow.

## Checklist

### Security
- **S1 No secrets in parameters.** No API keys, tokens or passwords in URLs, headers, JSON bodies, Code nodes or Set fields (look for `sk-`, `Bearer `, `api_key`, `password`, long random strings). Credentials must be n8n credentials.
- **S2 Webhooks are protected.** Every Webhook / Form / MCP Server Trigger has authentication, or an "Only run if" filter, or a documented reason why it's public.
- **S3 Least-privilege tools.** MCP Client Tool nodes use `include: selected` (or `except`) rather than `all` when the server has write tools. Agents get read tools only, unless a write is gated.
- **S4 No dangerous nodes on untrusted input.** Execute Command, SSH, raw SQL or Code nodes don't consume webhook/LLM text without validation.

### Reliability
- **R1 Retries on external calls.** HTTP Request, MCP Client, chat model and app nodes that call external services have `retryOnFail` (2–3 tries, a wait of 1–5 s).
- **R2 Non-idempotent writes don't blindly retry.** Create/send/charge nodes either have no retry or use an idempotency key. Flag retries on writes as a risk.
- **R3 An error workflow is set** (`settings.errorWorkflow`), and it notifies someone or logs the error.
- **R4 Timeouts.** HTTP Request nodes set `options.timeout`, and Wait nodes set a wait limit (`limitWaitTime`).
- **R5 Item references are safe after a Wait.** After a Wait / form resume, expressions use `$('Node').first()` (or `.last()`), not `$('Node').item`.

### AI and agent safety
- **A1 Structured output.** Any LLM output that later nodes branch on comes from structured output (`response_format` / `output_config` / Structured Output Parser), not free text parsed by hand.
- **A2 Uncertainty is routed.** There is a branch for low confidence / `needs_human` / `unknown` that doesn't call tools or write.
- **A3 Human approval before writes.** Every write or irreversible action triggered by an LLM decision passes a human approval step (form/webhook Wait, send-and-wait, or tool approval).
- **A4 Agent limits.** AI Agent nodes set `maxIterations`, and have a system message that says when to use the tools and to never invent data.

### Cost and maintainability
- **C1 Model fits the step.** Classification and extraction use a small/fast model, and agents a stronger one. Flag a top-tier model on a simple step.
- **C2 Cheap filters first.** Filtering (If / Switch / "Only run if") happens before LLM calls where possible.
- **C3 Readable.** There are sticky notes or Canvas Groups, nodes have descriptive names (not "HTTP Request1"), and config such as model and prompt lives in one place.
- **C4 Audit trail.** Decisions and outcomes are written somewhere: a Data Table, a sheet, a DB or a log.

## Output format

```markdown
## n8n workflow review — <workflow name>
**Score: X / Y**  ·  trigger: <type>  ·  AI nodes: <n>  ·  writes: <list>

| # | Check | Result | Evidence |
|---|---|---|---|
| S1 | No secrets in parameters | PASS | all calls use credentials |
| … | … | … | … |

### Top 3 fixes
1. **<fix>** — <node name>: <what to change, concretely>
2. …
3. …
```

## Notes

- Be specific: "add `retryOnFail` (3×2 s) on *Classify with Claude*", not "improve reliability".
- Don't rewrite the workflow unless asked. If the user asks for fixes, give them as node-by-node changes, or a corrected JSON fragment.
- Flag any assumption you made (e.g. "the MCP server's write tools are unknown, so S3 assumes they exist").
