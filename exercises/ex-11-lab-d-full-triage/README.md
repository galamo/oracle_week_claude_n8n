# Exercise 11 — Lab D: the full triage automation

**Module 5 · 30 minutes · Lab D part 2 · slides 38–43**

## Goal

Join everything into one automation: classify → route → agent → **human approval** → write back.

```
Webhook → Config → Classify → Parse JSON → Switch
   ├─ human    (needs_human or confidence < 0.7) → Data Table "human_queue" → Respond
   ├─ unknown                                     → Respond "please give more details"
   └─ agent    → Triage agent (read tools + structured output)
                   → IF action = create_ticket?
                        no  → Respond with the reply draft
                        yes → Respond "pending approval" + form link
                              → Wait (form: Approve / Reject)
                                   Approve → MCP Client: create_ticket → Data Table "ticket_created"
                                   Reject  → Data Table "rejected"
```

## Before you start

- Ex 8 and Ex 10 are done. The ops MCP server is running.
- The `triage_log` Data Table exists (`n8n/README.md` step 3).

## Steps

1. Import `start.workflow.json`. The classifier (top) and the agent (bottom) are there but not connected.
2. **Switch** after Parse JSON with 3 outputs:
   - `human`: `{{ $json.triage.needs_human || $json.triage.confidence < 0.7 }}` is true
   - `unknown`: `{{ $json.triage.category }}` equals `unknown`
   - `agent`: everything else
3. **human** → Data Table insert into `triage_log` (status `human_queue`) → Respond.
4. **unknown** → Respond with a polite "please tell us more".
5. **agent** → connect to the Triage agent. Turn on *Require Specific Output Format* and add a **Structured Output Parser** with the fields `action` (`create_ticket` / `reply_only` / `escalate`), `customer_id`, `order_id`, `reason`, `policy`, `ticket_summary`, `reply_draft`.
6. **IF** `{{ $json.output.action }}` equals `create_ticket`:
   - false → Respond with the reply draft.
   - true → **Respond** with `{ status: 'pending_approval', approve_here: $execution.resumeFormUrl, proposal: $json.output }`, then a **Wait** node (Resume: *On Form Submitted*) with a dropdown field `Decision` (Approve / Reject) and a `Note` field.
7. After the Wait: **IF** `{{ $json.Decision }}` equals `Approve`:
   - true → **MCP Client** node (not the Tool): ops-mcp, tool `create_ticket`, input as JSON built from the agent output → Data Table insert, status `ticket_created`
   - false → Data Table insert, status `rejected`
8. Publish, then run three requests:
   ```bash
   # 1. clear refund → pending_approval + a link. Open the link and approve.
   curl -X POST http://localhost:5678/webhook/lab-d -H "content-type: application/json" \
     -d '{"text":"My order 1042 arrived broken, I want my money back","email":"dana.cohen@example.com"}'
   # 2. unclear → queued_for_human
   curl -X POST http://localhost:5678/webhook/lab-d -H "content-type: application/json" \
     -d '{"text":"hmm something with my thing, not sure","email":"dana.cohen@example.com"}'
   # 3. the same refund again, but REJECT it in the form
   ```

## Done when

- Approve → a new ticket appears in `demo-5-ops-mcp-server/data/tickets.json`, and `triage_log` has a `ticket_created` row with its `ticket_id`.
- Reject → no ticket, a `rejected` row.
- The unclear request → a `human_queue` row and no agent run.

## Hint (this one costs everybody 10 minutes)

After a **Wait** node, `$('Triage agent').item` returns nothing, because n8n loses item pairing when an execution pauses. Use **`$('Triage agent').first()`**.
