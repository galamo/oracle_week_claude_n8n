# F2 — Three-layer architecture (Module 1, slide 8)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Flow: "Trigger -> Reason -> Act -> Write back". Four columns: ORCHESTRATION (n8n: Webhook trigger, Switch, Data Table), REASONING (Claude: system prompt, JSON schema), TOOLS (MCP server: lookup_customer, get_order, search_kb, create_ticket), SYSTEMS (CRM JSON, KB files, ticket table). Phases: webhook fires with a request; n8n sends prompt to Claude; Claude asks for lookup_customer; packet goes n8n MCP client -> MCP server -> CRM and back; Claude returns decision JSON; n8n Switch branches; write-back to ticket table; reply sent to requester. Colour each layer by its token (n8n = --res, Claude = --req, MCP = --tool, systems = --ok). Show a small "who executes this step" label under each packet. Final toast: "3 layers · 1 automation". Static strip: the 3-layer stack with responsibilities.
```
