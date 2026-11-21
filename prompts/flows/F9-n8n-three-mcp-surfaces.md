# F9 — The three MCP surfaces of n8n (Module 4, slide 34)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Flow: "n8n speaks MCP in both directions". Three panels animated in sequence: (1) MCP Client Tool: n8n AI Agent -> external MCP server (our ops server at host.docker.internal:3200/mcp) — n8n is the client; (2) MCP Server Trigger: Claude Desktop / Cursor -> an n8n workflow exposed at /mcp/ops-triage whose attached tool triage_request becomes an MCP tool — n8n is the server for ONE workflow; (3) Instance-level MCP server: Claude Code -> the n8n instance MCP endpoint to search, build, publish and run workflows — n8n control plane as tools. For each panel show arrow direction, who is host, and one example prompt bubble. End with a 3-column summary card. Use --tool for MCP traffic and --res for n8n. Static strip: matrix of surface x direction x typical use x auth.
```
