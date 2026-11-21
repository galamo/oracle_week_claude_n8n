# Demo 2 — Structured output is the contract

**Module 2 · ~7 minutes · slide 13 "Structured output is the contract"**

One messy customer request is sent to Claude three ways. A tiny "n8n Switch" then tries to route each answer:

| Round | How we ask | What usually happens |
| --- | --- | --- |
| 1 | Just ask "classify this" | Friendly prose. `JSON.parse` fails and the Switch gets nothing, so the workflow breaks |
| 2 | Ask for JSON in the prompt | Often works, but sometimes a ```` ```json ```` fence, extra text or a missing field breaks it. You can't build on "often" |
| 3 | Structured outputs: `response_format` with a JSON Schema | Always valid JSON with every field, and the Switch routes it |

The last line is the important one: the schema guarantees the **shape**, not the **meaning**. The Switch still sends low confidence or `needs_human` to a person.

## Run it

```bash
# once, in the repo root: cp .env.example .env  → paste OPENROUTER_API_KEY
cd demo-2-structured-output
npm run demo                          # all three rounds
npm run demo -- --round 3             # one round
npm run demo -- --show-request        # also print the exact HTTP body (great for slide 12 "anatomy")
npm run demo -- --text "Where is order 1042?"
```

**Raw HTTP version (curl, like an n8n HTTP Request node):**

```bash
npm run curl:free-text
npm run curl:structured
```

The request bodies are in `requests/*.json`, so you can open them in Postman too.

## Anthropic API vs OpenRouter: same idea, different field names

The slides use Anthropic's names. These demos call Claude through OpenRouter's OpenAI-compatible API:

| Concept | Anthropic Messages API | OpenRouter (Chat Completions) |
| --- | --- | --- |
| Endpoint | `POST /v1/messages` | `POST /api/v1/chat/completions` |
| System prompt | top-level `system` | a `{ role: "system" }` message |
| Structured output | `output_config.format: { type: "json_schema", schema }` | `response_format: { type: "json_schema", json_schema: { name, strict: true, schema } }` |
| Where the JSON comes back | `content[0].text` | `choices[0].message.content` |
| Stop reason | `stop_reason: end_turn / tool_use / max_tokens` | `finish_reason: stop / tool_calls / length` |
| Token usage | `usage.input_tokens / output_tokens` | `usage.prompt_tokens / completion_tokens` |

`provider.require_parameters: true` (set in `shared/openrouter.js`) makes OpenRouter use only providers that really enforce the schema for that model.

## Talking points

1. **Round 1:** *"This is what most first attempts look like. Nice for a human, useless for a workflow."*
2. **Round 2:** *"Asking nicely works most of the time. Run it 100 times a day and 'most of the time' becomes several broken executions a week."*
3. **Round 3:** run it with `--show-request` and point at `response_format`. *"Now it's a contract. n8n can branch on `category` without any parsing hacks."*
4. **Lab A bridge:** the schema and prompt here (`triage.schema.json`, `triage.md`) are the starting point for Lab A.
