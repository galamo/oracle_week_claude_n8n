# Exercise 0 — Environment check

**Opening · 10 minutes · on your own · slide 4**

## Goal

Make sure everything works *before* we need it: Node.js, Docker, n8n, your OpenRouter key and one real call to Claude.

## Steps

1. Get the repo and create your settings file:
   ```bash
   cd oracle_week_
   cp .env.example .env
   ```
   In `.env`, paste your `OPENROUTER_API_KEY` and set `MCP_TOKEN` to a long random string (`openssl rand -hex 24` makes one).
2. Start n8n (first time takes 1–2 minutes to download):
   ```bash
   cd n8n && docker compose up -d && cd ..
   ```
   Open http://localhost:5678 and create your local owner account.
3. Run the check:
   ```bash
   node exercises/ex-00-environment-check/check.js
   ```

## Done when

Every line shows ✔, including `Claude answered: "ready"` with token usage.

## Stuck?

Each ✘ line prints a `fix:` hint. If it's still red, raise your hand. Don't sit on it, because everything after this depends on it.
