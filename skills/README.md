# Skills

Claude skills used and shown in the seminar. Each skill is a folder with a `SKILL.md` file: its frontmatter tells Claude **when** to use the skill, and the body tells it **how**.

| Skill | Use it for | Shown in |
| --- | --- | --- |
| [`agentic-fit-check`](agentic-fit-check/SKILL.md) | "Should this process be agentic?" Two-step Need/Control score → architecture, risk, guardrails, cost | Module 1 (after Ex 1) and the wrap-up |
| [`n8n-workflow-review`](n8n-workflow-review/SKILL.md) | Review an n8n workflow export: security, reliability, AI safety, cost → scored checklist + top 3 fixes | Wrap-up: run it on your Lab D export |

## Install

**Claude Code, this repo only:**

```bash
mkdir -p .claude/skills && cp -R skills/* .claude/skills/
rm .claude/skills/README.md
```

**Claude Code, all your projects:** copy the folders to `~/.claude/skills/` instead.

**Claude app (claude.ai / desktop):** zip one skill folder (e.g. `agentic-fit-check/`) and upload it in Settings → Capabilities → Skills.

## Try them

- *"Should our supplier-invoice intake be agentic? About 400 PDFs a month, different layouts, finance pays from the ERP."*
- *"Review this n8n workflow"*, then attach `solutions/ex-11-lab-d-full-triage/solution.workflow.json` or your own export.
