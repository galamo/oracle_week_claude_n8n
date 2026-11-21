# Exercise 8 — Webhook → Claude → Respond

**Module 4 · 15 minutes · Lab C part 1 · slides 31–33**

## Goal

Turn your Lab A classifier into an n8n workflow: an HTTP request comes in, Claude classifies it with structured output, and n8n returns the JSON.

```
Webhook (POST /triage) → Config → Classify with Claude (HTTP Request) → Parse JSON → Respond to Webhook
```

## Before you start

n8n is running, and the `OpenRouter` credential exists (see `n8n/README.md` steps 1–2).

## Steps

1. Import `start.workflow.json` (Workflows → Import from File). It's a Webhook that just echoes the body back.
2. Add an **Edit Fields** node called **Config** after the Webhook, with these string fields:
   - `model` = `anthropic/claude-haiku-5.5`
   - `system_prompt` = your Lab A prompt (paste the text)
   - `schema_json` = your Lab A schema (paste the JSON)
   - `text` = `{{ $json.body.text }}`
   - `email` = `{{ $json.body.email }}`
3. Add an **HTTP Request** node called **Classify with Claude**:
   - POST `https://openrouter.ai/api/v1/chat/completions`
   - Authentication: *Predefined credential type* → **OpenRouter** → `OpenRouter`
   - Send Body → JSON → *Using JSON* → an expression that builds `{ model, max_tokens, messages: [system, user], response_format: { type: "json_schema", json_schema: { name, strict: true, schema } } }`. Use `JSON.parse($json.schema_json)` for the schema.
4. Add an **Edit Fields** node called **Parse JSON**: a field `triage` of type **Object** = `{{ JSON.parse($json.choices[0].message.content) }}`.
5. Make **Respond to Webhook** return `{{ JSON.stringify($json.triage) }}`.
6. Click **Execute workflow**, then in a terminal:
   ```bash
   curl -X POST http://localhost:5678/webhook-test/triage \
     -H "content-type: application/json" \
     -d '{"text":"My order 1042 arrived broken, I want my money back","email":"dana.cohen@example.com"}'
   ```

## Done when

`curl` gets back the classification JSON (`category: "refund"`, `confidence`, `needs_human`…), and you can open the execution and see the data at every node.

## Hints

- If the HTTP node says *"JSON parameter needs to be valid JSON"*, your expression must return a string: wrap the object in `JSON.stringify( … )`.
- `$json` is the output of the **previous** node. To read an older node, use `$('Config').item.json.text`.
