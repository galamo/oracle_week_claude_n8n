# F3 — Claude tool-call loop (Module 2, slide 14)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Flow: "The tool-use loop in the Messages API". Left: YOUR APP (n8n or a Node script). Center: CLAUDE. Right: TOOL (get_order_status). Show a growing messages[] array panel at the bottom that appends each turn as a chip (user, assistant tool_use, user tool_result, assistant text). Phases: POST /v1/messages with tools[] and user message; Claude responds stop_reason:"tool_use" with a tool_use block {id:"toolu_01", name:"get_order_status", input:{order_id:"1042"}}; app (not Claude) executes the tool; app POSTs again with tool_result referencing toolu_01; Claude responds stop_reason:"end_turn" with final text; loop counter badge "iteration 1 / max 5". Highlight the critical teaching point in a callout: "Claude never runs the tool — your code does." Add a second short cycle with two parallel tool_use blocks. Static strip: the loop as a circle with 4 labelled arrows. Also show a small toggle "Anthropic API / OpenRouter" that swaps the field names (tool_use -> tool_calls, stop_reason -> finish_reason, tool_result -> role:"tool").
```
