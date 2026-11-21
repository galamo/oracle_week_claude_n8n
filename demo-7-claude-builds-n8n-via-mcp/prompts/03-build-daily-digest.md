# Prompt 3 — Build a daily digest (different trigger, Data Table + Claude summary)

Needs the `triage_log` Data Table from Lab D, with a few rows in it. Run Lab D a few times first.

```text
Using the n8n-instance MCP tools, create a NEW workflow named "Demo 7 — Daily triage digest".

What it does: every morning at 08:00 (Asia/Jerusalem) it reads yesterday's triage results and writes
a short management summary.

Nodes:
1. Schedule Trigger — every day at 08:00.
   Also add a Manual Trigger connected to the same next node, so I can test it now.
2. Data Table "Get rows" — table "triage_log", return all rows created in the last 24 hours
   (if filtering by date is not possible in the node, get all rows and filter in the next step).
3. A node that aggregates the rows into counts: total, by status (human_queue, ticket_created, rejected)
   and by category. Prefer built-in nodes (Filter / Aggregate / Summarize) over a Code node.
4. HTTP Request "Summarize with Claude" — POST https://openrouter.ai/api/v1/chat/completions with my existing
   "OpenRouter" credential (predefined credential type), model anthropic/claude-haiku-5.5, max_tokens 250.
   System: "You write a 4-line operations digest for a support manager. Numbers first, then one risk, then
   one suggestion. Use only the numbers given. Never invent data."
   User: the counts as JSON.
5. Edit Fields "Digest" — fields: date (today, ISO), counts (object), digest_text (Claude's answer).

Add a sticky note: what it does and that a Slack/Email node can be added after "Digest".

Rules:
- Do NOT publish the workflow.
- Then RUN it once via the manual trigger if your tools allow running workflows, and show me the digest_text.
  If you cannot run it, tell me how to run it in the editor.
- Report any node or parameter you had to change.
```
