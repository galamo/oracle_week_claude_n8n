# Exercise 2 — A classifier that returns validated JSON

**Module 2 · 15 minutes · Lab A part 1 · slide 17**

## Goal

Write the **system prompt** and the **JSON Schema** for a request classifier. The JSON it returns is the contract the n8n workflow will branch on later today, so it has to be right every time.

## The contract

| Field | Type | Allowed values |
| --- | --- | --- |
| `category` | string | `refund`, `shipping`, `billing`, `technical`, `account`, `other`, `unknown` |
| `priority` | string | `high`, `medium`, `low` |
| `confidence` | number | 0 to 1 |
| `needs_human` | boolean | `true` / `false` |
| `summary` | string | one sentence, max 20 words, English |
| `order_id` | string | the order/invoice id, or `""` if none |

## Steps

1. Open `starter/schema.json`. It's incomplete: add the missing fields, complete the `category` enum, list all six in `required`, and add `"additionalProperties": false`.
2. Open `starter/prompt.md` and fill every `TODO`. Remove the `<!-- -->` comments when you're done.
3. Run the 5 test inputs (from the repo root):
   ```bash
   node exercises/ex-02-classifier-schema/run.js
   ```
   The runner checks your schema first, so you don't spend tokens on a broken one. Then it calls Claude once per input.
4. If an input fails, improve the **rules** in your prompt (definitions, not more examples) and run again.

## Done when

`Schema check ✔` and `5/5 passed`: every input returns schema-valid JSON with the expected category, including the Hebrew one.

## Hints

- Structured outputs on OpenRouter means `response_format: { type: "json_schema", json_schema: { name, strict: true, schema } }`. The runner does that for you, so look at how it's done in `run.js`.
- Structured outputs don't support `minimum` / `maximum`. Put "0 to 1" in the field's `description` instead.
- A good prompt has a role, a task, constraints, the output contract, and a way out. You'll need the way out in Exercise 3.
