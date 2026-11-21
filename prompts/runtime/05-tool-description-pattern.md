# P3 — Tool description pattern (MCP and function tools)

**Teaching point:** a tool description is a prompt. Say **when to use** it, **what it returns**, its **side effects**, and the **failure case**. Keep the input schema strict.

## Template

```text
name: <verb_noun>
description: <What it does, one sentence>. Use when <the situation>. Returns <fields>. <Read-only | WRITE ACTION — requires human approval>. <Failure case, e.g. returns {found:false} — never retry with guessed values>.
input: { <field>: <type + format>, ... }   required: [...]   additionalProperties: false
```

## Example — read tool

```text
name: get_order
description: Get one order by its id. Use when the request mentions an order number. Returns status, items, dates, total. Read-only. Returns {found:false} if the id does not exist — never retry with guessed ids.
input: { order_id: string, pattern ^[0-9]{4,8}$ }
```

## Example — write tool

```text
name: create_ticket
description: WRITE ACTION — requires human approval before calling. Creates a support ticket for a customer. Call only after you looked up the customer and the policy, and only when the policy requires a ticket. Returns the new ticket id.
input: { customer_id: string ^C-\d{4}$, category: enum, priority: enum, summary: string 5–200, order_id?: string }
```

Live versions of all ops-mcp tools: `demo-5-ops-mcp-server/src/tools.js`.
