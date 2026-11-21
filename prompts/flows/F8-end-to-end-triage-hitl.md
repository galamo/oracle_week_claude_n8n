# F8 — End-to-end triage with HITL and error path (Module 5, slides 38–42)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Flow: "The full triage agent". n8n canvas: Webhook -> Claude classify (JSON) -> Switch(category, confidence) -> AI Agent with MCP Client Tool (read tools: lookup_customer, get_order, search_kb) -> IF action = create_ticket -> Respond "pending approval" with a form link -> Wait (approval form: Approve / Reject) -> MCP Client create_ticket -> Data Table triage_log write-back. Separate Error Workflow lane at the bottom (Error Trigger -> Data Table alerts). Run three scenarios one after another, labelled in the caption: (1) happy path, approved -> ticket T-0001; (2) confidence 0.55 -> routed to human queue, no tools called; (3) MCP server down -> node retries 3 times with backoff -> fails -> Error Workflow writes an alert with the execution id. During the approval phase show a clock "waiting for human" and the audit entry "approved by ops at 14:22". Show a running token/cost meter per scenario. Static strip: the pipeline as 7 labelled stages with guardrails marked under each.
```
