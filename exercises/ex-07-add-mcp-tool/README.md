# Exercise 7 — Add your own tool to the MCP server

**Module 3 · 15 minutes · Lab B part 3 · slide 24**

## Goal

Add a 5th tool, `get_sla_policy`, to the ops MCP server and watch it appear in every connected host, with no change to Cursor, Claude Code or n8n.

## The tool

| | |
| --- | --- |
| Name | `get_sla_policy` |
| Input | `tier`: one of `standard`, `gold`, `platinum` |
| Output | the response time in hours for that tier, and the policy source (KB-14 in `data/kb.json`) |
| Type | read-only |

## Steps

1. Open `demo-5-ops-mcp-server/src/tools.js`. Copy the `get_order` block as your template.
2. Change the name, and write the **description as a prompt**: when to use it, what it returns, that it's read-only.
3. Use `z.enum([...])` for `tier`, so Claude can't send anything else.
4. In the handler, return `{ tier, response_time_hours, source }` through the `result(...)` helper. The hours are in KB-14: standard 48, gold 24, platinum 4.
5. Restart the server (`Ctrl+C`, then `npm start`; or run `npm run dev`, which restarts on save).
6. Check it:
   - `npm test`: `tools/list` should now show 5 tools.
   - In MCP Inspector (`npm run inspector`), call `get_sla_policy` with `gold`.
   - In Cursor, ask: *"Customer C-1003 wrote an hour ago. How long do we have to answer?"*

## Done when

- `tools/list` shows `get_sla_policy`, and the Inspector returns `24` for `gold`.
- In Cursor, Claude calls `lookup_customer` **then** `get_sla_policy` on its own, and answers with the right number of hours for that customer's tier.

## Think about

You didn't touch Cursor's config. Why did the new tool just appear?
