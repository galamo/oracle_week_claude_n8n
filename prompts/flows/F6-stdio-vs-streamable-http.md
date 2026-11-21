# F6 — stdio vs Streamable HTTP (Module 3, slide 21)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Flow: "Two ways a host talks to an MCP server". Top half STDIO: Claude Desktop launches a child process (npx @modelcontextprotocol/server-filesystem ./demo-data); show stdin/stdout pipes as two thin tubes with newline-delimited JSON-RPC messages moving through; same machine, no port, dies with the host. Bottom half STREAMABLE HTTP: n8n and Cursor (two hosts) both POST to http://localhost:3200/mcp with an Authorization bearer header; server is a separate long-running process, can be remote and shared. Phases alternate top/bottom with the same tools/call so the comparison is direct. End with a decision box: "local dev tool -> stdio | shared, remote, n8n -> Streamable HTTP". Note on screen: n8n MCP nodes do not support stdio. Static strip: comparison table (launch, network, auth, sharing, typical hosts).
```
