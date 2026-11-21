# Bonus — n8n as an MCP server for Claude (Lab C on the slides)

**Module 4 · 15 minutes · slide 34 option 2 and slide 36**

## Goal

Turn your Ex 8 classifier into an **MCP tool** that Claude Desktop, Cursor or Claude Code can call. This flips the direction: before, n8n called Claude; now **Claude calls n8n**, which is the use case on slide 3.

```
Claude / Cursor ──MCP──► n8n MCP Server Trigger (/mcp/ops-triage)
                              └─ tool "triage_request" ──► sub-workflow: Config → Classify → Parse JSON
```

## Steps

1. **The sub-workflow.** Duplicate your Ex 8 workflow and replace the Webhook with **When Executed by Another Workflow**, with inputs `text` and `email`. Change Config to read `{{ $json.text }}` / `{{ $json.email }}`. Remove the Respond node. The last node's output is the tool result. Publish it.
2. **The MCP server.** Create a new workflow:
   - **MCP Server Trigger**: path `ops-triage`, Authentication **Bearer Auth** → `ops-mcp token`
   - Attach a **Call n8n Workflow Tool**: name it `triage_request`, write a description (when to use it, what it returns), pick your sub-workflow, and map `text` and `email` using **"Let the model define this"**
   - Publish it. Copy the **Production URL** from the trigger (`http://localhost:5678/mcp/ops-triage`).
3. **Connect a host:**
   - Claude Code: `claude mcp add --transport http n8n-triage http://localhost:5678/mcp/ops-triage --header "Authorization: Bearer $MCP_TOKEN"`
   - Cursor: add it to `.cursor/mcp.json` like ops-mcp, with the URL above
4. Ask Claude: *"Triage this customer message: 'my order 1042 arrived broken and I want a refund'."*

## Done when

Claude calls `triage_request`, an execution appears in n8n, and Claude shows the category, priority and confidence.

## Think about

You now have **two** MCP servers: ops-mcp (code) and n8n (no code). When would you build a tool in n8n rather than in code?
