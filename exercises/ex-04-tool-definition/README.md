# Exercise 4 — Define a tool and read the tool call

**Module 2 · 10 minutes · after Demo 3 · slide 14**

## Goal

Write your first tool definition, `get_order_status`, and see the exact block Claude sends back when it wants to use it. Then answer the key question of the day: **who runs the tool?**

## Steps

1. Open `starter/tool.json` and fill it in:
   - `name`: `get_order_status`
   - `description`: written as a prompt. Say when to use it, what it returns, that it's read-only, and what happens if the order doesn't exist.
   - `parameters`: one required string field `order_id`. Describe its format.
2. Send one request with your tool (from the repo root):
   ```bash
   node exercises/ex-04-tool-definition/ask.js
   ```
   The customer asks "where is my order 1042?".
3. Read the output: `finish_reason`, then the `tool_call` block with `id`, `function.name` and `function.arguments`.
4. Write down your answer: **who runs the tool now?**
5. Run it again with `--run` to finish the loop:
   ```bash
   node exercises/ex-04-tool-definition/ask.js --run
   ```

## Done when

- `finish_reason: tool_calls` and the tool call contains `"order_id":"1042"`.
- With `--run`, Claude answers with the real status (delivered by Israel Post on Nov 17).
- You can explain in one sentence who runs the tool, and why that matters.

## Hint

If Claude answers without calling your tool, the description is too vague. Tell it *when* to use the tool.
