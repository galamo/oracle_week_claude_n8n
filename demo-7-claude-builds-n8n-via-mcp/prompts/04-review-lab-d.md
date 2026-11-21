# Prompt 4 — Review Lab D with the n8n-workflow-review skill

First install the skill for this repo (once): `mkdir -p .claude/skills && cp -R skills/n8n-workflow-review .claude/skills/`

```text
Use the n8n-workflow-review skill.

Get the workflow whose name starts with "Lab D" through the n8n-instance MCP tools (read it, do not change it),
and review it against the skill's checklist. Give me the scored table and the top 3 fixes, naming the exact nodes.

Then STOP and ask me which fixes to apply. Do not update or publish the workflow until I say which ones.
```

**What to show:** the agent combines a **skill** (how to review), an **MCP server** (access to n8n) and a **human decision** (which fixes to apply). That's the day's three layers in one prompt.
