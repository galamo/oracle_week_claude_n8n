# Prompt 3 — Explain and harden

```text
Explain this workflow in 5 bullet points for a manager.
Then make it production-ready:
- retry the Claude call up to 3 times with 2 seconds between tries, and set a 30-second timeout
- limit how long the approval waits (24 hours)
- tell me what would happen today if OpenRouter is down, and suggest an error workflow that alerts someone
Show me the changes before applying them, and do not publish.
```

**What to point at:** compare its answer with Ex 12 and the `n8n-workflow-review` skill checklist. Did it think of the non-idempotent-retry problem? If not, that's a good reminder that a human still reviews the work.
