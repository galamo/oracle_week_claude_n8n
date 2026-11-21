# Demo 8 — n8n Assistant: "build me a workflow that…"

**Lunch break or Module 4 (optional) · ~5 minutes · "where the platform is heading"**

n8n's built-in **Assistant** is an agent that lives *inside* n8n: you describe a goal in chat, and it plans, builds, runs and fixes the workflow on the canvas. This folder only has the **prompts to type into the Assistant**; the Assistant builds the workflows live.

It's a preview feature: show it as a "wow", and don't build labs on it.

## Setup: it needs more than our seminar n8n

Our `n8n/docker-compose.yml` is plain n8n. The Assistant also needs a **model provider key** (Anthropic, OpenAI or OpenRouter) and a **sandbox** where it runs code. Pick one option:

**Option A — n8n's one-line Docker install (self-hosted, recommended for this demo).** n8n 2.35+ sets up n8n with the code sandbox and web search, with the Assistant enabled. You then add your model key in the UI, and OpenRouter is supported.

```bash
# 1. stop the seminar n8n first (both use port 5678). In the repo root:
cd n8n && docker compose down
# 2. install the Assistant-ready n8n in a NEW, empty folder outside this repo:
mkdir -p ~/n8n-assistant && cd ~/n8n-assistant
curl -fsSL https://get.n8n.io | sh
```

Then open http://localhost:5678, create the owner, open **Assistant**, and connect **OpenRouter** with your key. Afterwards switch back: `docker compose -f ./n8n/compose.yml down` here, then `cd n8n && docker compose up -d` in the repo.

**Option B — n8n Cloud trial.** The Assistant is on by default for new Starter and Pro Cloud instances. This is the least setup, but it isn't on your laptop, so the ops MCP server isn't reachable without a tunnel (see Demo 9).

Check before Sunday: run Prompt 1 once, and keep a screen recording as a fallback.

## Run the demo

Type these into the Assistant chat (from `prompts/`):

| Prompt | What it shows | Time |
| --- | --- | --- |
| [`01-build-from-goal.md`](prompts/01-build-from-goal.md) | A goal, in plain language, becomes a working workflow: webhook + Claude classification + routing | 2 min |
| [`02-extend-with-approval.md`](prompts/02-extend-with-approval.md) | Iterating: "now add a human approval before…" | 2 min |
| [`03-explain-and-harden.md`](prompts/03-explain-and-harden.md) | The Assistant explains its workflow and adds retries and an error path | 1 min |

## Talking points

- **Demo 7 vs Demo 8:** same goal (an AI builds the workflow). In Demo 7 *your* coding agent drives n8n from outside over MCP, with your repo, skills and rules. In Demo 8, n8n's own agent works inside the editor. The first gives you more control and reuse; the second is less setup for business users.
- **Review before you publish:** the preview Assistant can make mistakes. The same rule applies as for any agent: a human checks and publishes.
- **The Assistant uses the same building blocks you learned today:** webhook, HTTP or AI nodes, Switch, Wait. That's why the day taught the blocks and not just the chat box.

## Sources

- [AI Assistant on self-hosted n8n: easier setup in 2.35](https://community.n8n.io/t/ai-assistant-on-self-hosted-n8n-easier-setup-in-2-35/308257) (n8n community)
- [Assistant update: one-line self-hosting](https://community.n8n.io/t/assistant-update-agents-mcp-servers-one-line-self-hosting-and-more/312573) (n8n community)
- [Set up n8n Assistant](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-n8n-assistant) · [One-line setup](https://docs.n8n.io/deploy/host-n8n/install-options/one-line-setup) (n8n docs)
