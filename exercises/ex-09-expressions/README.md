# Exercise 9 — Expressions drill

**Module 4 · 8 minutes · slide 32**

## Goal

Get comfortable with n8n expressions: reading the webhook body, safe defaults for missing fields, optional chaining, and the current time.

## Steps

1. Import `start.workflow.json`. The **Map fields** node has six fields whose values are `TODO…` text.
2. Replace each value with an expression (click the field → *Expression*):

| Field | Should become |
| --- | --- |
| `text` | the body text, with spaces trimmed |
| `email` | `body.email`, or `'n/a'` when missing |
| `channel` | `body.channel`, or `'web'` when missing |
| `customer_name` | `body.customer.name`, or `'unknown'`. Careful: `customer` itself may be missing |
| `received_at` | the current time as an ISO string |
| `prompt_preview` | one sentence: `Customer <name> (<email>) via <channel> wrote: <text>` |

3. Click **Execute workflow** and test **both** requests:
   ```bash
   curl -X POST http://localhost:5678/webhook-test/map -H "content-type: application/json" \
     -d '{"text":"  hi there  ","email":"a@b.com","channel":"whatsapp","customer":{"name":"Dana"}}'

   curl -X POST http://localhost:5678/webhook-test/map -H "content-type: application/json" \
     -d '{"text":"hi"}'
   ```

## Done when

Both calls answer without an error. The second one shows `n/a`, `web` and `unknown`.

## Hints

`??` gives a default for `null` / `undefined`. `?.` stops at a missing object. `$now` is the current time (a Luxon date).
