# Demo 3 — The tool-use loop, by hand

**Module 2 · ~8 minutes · slide 14 "The tool-use loop"**

The most important mental model of the day: **Claude never runs a tool. It asks, and your code runs it.**

The script gives Claude two tools (`get_order`, `search_policy`) and a customer question. Then it prints every step of the loop:

```
Turn 1  → POST /chat/completions  (2 messages + 2 tool definitions)
        ← finish_reason: tool_calls
        ← tool_call get_order {"order_id":"1042"}  id=call_1
        ⚙ your code ran get_order → {"found":true,"order":{...}}
        → tool result added (tool_call_id=call_1)
Turn 2  ...  search_policy ...
Turn 3  ← finish_reason: stop
Claude (final answer): Yes, a full refund applies (KB-01). Because the blender costs 349 ILS,
over 200 ILS, you will get a free return label (KB-03).
```

That last line is a nice moment: the answer to "can I keep the blender?" comes from the **policy data** (KB-03: only under 200 ILS), not from the model's imagination.

## Run it

```bash
# once, in the repo root: cp .env.example .env  → paste OPENROUTER_API_KEY
cd demo-3-tool-call-loop
npm run demo:step        # pauses before each step: press Enter (best on stage)
npm run demo             # runs straight through
npm run demo -- --question "Where is order 1050 and when will it arrive?"
npm run demo -- --question "Can I return order 9999?"     # tool says found:false — watch it not invent
```

It uses `OPENROUTER_AGENT_MODEL` from the repo-root `.env` (a Sonnet-class model by default), because tool use is agent work.

## Files

```
src/tools.js      tool DEFINITIONS (sent to Claude) + tool FUNCTIONS (run by you)
src/run-demo.js   the loop: send → tool_calls? → run → send results → until finish_reason "stop"
```

The order and policy data are read from `../demo-5-ops-mcp-server/data/`, the same data the MCP server serves.

## Anthropic API vs OpenRouter field names

| Step | Anthropic Messages API | OpenRouter (Chat Completions) |
| --- | --- | --- |
| Tool definition | `{ name, description, input_schema }` | `{ type: "function", function: { name, description, parameters } }` |
| Claude asks for a tool | content block `tool_use` with `id`, `name`, `input`; `stop_reason: "tool_use"` | `message.tool_calls[]` with `id`, `function.name`, `function.arguments` (a JSON string); `finish_reason: "tool_calls"` |
| You send the result | user message with a `tool_result` block, `tool_use_id` | `{ role: "tool", tool_call_id, content }` |
| Done | `stop_reason: "end_turn"` | `finish_reason: "stop"` |

## Talking points

1. **Run with `--step`** and stop at "⚙ your code ran get_order". *"Who ran this? Not Claude. This script did."*
2. **Parallel calls:** Claude often asks for several tools in one turn. The script runs them all and returns every result.
3. **`MAX_ITERATIONS = 5`** is a guardrail. An agent loop without a limit is a cost and safety risk.
4. **Bridge to MCP (Module 3):** *"Right now the tool functions live in `tools.js`. MCP moves them into a server, so Claude Desktop, Cursor and n8n can all use the same tools without copying this code."* Then show Demo 5.
