# Demo 1 — Who chooses the path? (deterministic vs agentic)

**Module 1 · ~8 minutes on stage · slide 5 "Who chooses the path?"**

The same 8 customer requests go through two routers:

| Router | How it decides | Like in n8n |
| --- | --- | --- |
| **Rules** | First keyword match wins, top to bottom | A Switch node with "contains" rules |
| **Claude** (via OpenRouter) | Reads the message, returns JSON that always matches `schemas/triage.schema.json` | An HTTP Request node calling OpenRouter |

Rules get 2/8 right, both on the simple requests. The interesting part is *how* they fail: a mixed message goes to the wrong team, Hebrew and sarcasm fall into "other", and a prompt injection gets routed straight to refunds.

## Run it

Needs Node 22+ and nothing else (no npm install).

The API key lives in the repo-root `.env` (shared by all demos): `cp ../.env.example ../.env` and paste your `OPENROUTER_API_KEY`.

```bash
npm run demo:rules          # 1. rules only — no key needed
npm run demo                # 2. rules + Claude, side by side
npm run record              # once, while online: saves Claude's answers
npm run demo:offline        # backup: replays the recording if the wifi dies
node src/run-demo.js --only 8   # show one request in isolation
```

Before Sunday: run `npm run record` once, so `npm run demo:offline` works on stage. Set `PRICE_IN_PER_MTOK` / `PRICE_OUT_PER_MTOK` in the root `.env` to your model's price if you want the cost shown in the scoreboard.

## Files

```
data/requests.json           8 requests, each with the expected category and why it's there
src/rules-router.js          the keyword "Switch" — edit RULES live to show how brittle it gets
src/claude-router.js         one call to OpenRouter /chat/completions with response_format json_schema
src/run-demo.js              runs both and prints the comparison + scoreboard
prompts/triage.md            the system prompt (same one Lab A builds)
schemas/triage.schema.json   the output contract (same one Lab A builds)
```

## How to present it (talking points)

1. **Run `npm run demo:rules` first.** #1 and #2 pass in under a millisecond and cost nothing. Say: *"For predictable input, this is the right tool. Don't use AI here."*
2. **Point at the failures:**
   - #3: the word "package" sends a refund request to the shipping team.
   - #4: sarcasm has no keywords, so it lands in "other".
   - #5: Hebrew falls into "other".
   - #6: rule order decides the team, and "email address" wins.
   - #8: the rules route a prompt injection to **refunds**. This is the scary one.
3. **Ask the room:** *"How many rules would we need to fix this?"* Then add a keyword live in `src/rules-router.js` and break something else.
4. **Run `npm run demo`.** Claude handles the messy ones. Point out three things:
   - **`unknown` is allowed (#7).** The prompt gives Claude a way out, so it doesn't guess.
   - **`→ human` (#8).** Claude treats the request as data, not as instructions, and flags it for a person.
   - **The scoreboard.** Claude is more accurate, but slower and costs tokens. That trade-off is the whole point of Module 1.
5. **Bridge to Module 2:** *"The JSON always parses because of structured outputs (`response_format: json_schema` on OpenRouter, `output_config.format` on Anthropic's API). That schema is the contract between Claude and n8n, and you'll write it yourselves in Lab A."*

## Things to know

- If a request returns an API error, check `OPENROUTER_MODEL` in the root `.env` against https://openrouter.ai/models (filter: structured outputs).
- Claude's answers can vary slightly between runs (confidence values, summary wording). Use the recording if you need identical output on stage.
- Cost: 8 short requests on a small model cost a fraction of a cent.
