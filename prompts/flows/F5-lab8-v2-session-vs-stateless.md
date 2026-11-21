# F5 — Lab 8 v2: MCP session vs stateless (Module 3, slide 22)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Rebuild my existing Lab 8 animation (Cursor host <-> Quiz MCP server, Express on localhost:3200/mcp, tools list_topics, get_question, check_answer) with a mode toggle at the top: "2025-11-25 (sessions)" and "2026-07-28 (stateless)".
Session mode = the current flow: POST initialize -> server creates transport and stores mcp-session-id in a transports Map -> GET /mcp opens SSE -> POST tools/list -> tools/call list_topics, get_question -> result -> check_answer -> DELETE ends session.
Stateless mode (current spec): no initialize, no session Map, no GET stream, no DELETE. Each POST carries headers MCP-Protocol-Version: 2026-07-28, Mcp-Method (tools/list | tools/call) and Mcp-Name (e.g. get_question), and the body carries protocolVersion + clientCapabilities in _meta. The client first sends server/discover. Show a load balancer between Cursor and TWO identical server instances; consecutive requests land on different instances and still work. tools/list response shows a cache badge (ttl). The response to POST may stream.
When switching modes, animate the removed parts (session layer, GET and DELETE verbs) fading out with a strike-through label "removed in 2026-07-28". Keep the original layout, colours and caption style. Static strip: a 2-column before/after table of headers and steps.
```
