# B2 — Prompt: let Claude Code build an n8n workflow through n8n's MCP server

**Used in:** the wrap-up demo D7 ("MCP works in both directions"). Needs n8n's **instance-level MCP server** enabled
(n8n → Settings → MCP) and connected in Claude Code. The expected result looks like
`solutions/ex-08-webhook-classify/solution.workflow.json`.
**Updated:** it now calls Claude through OpenRouter with the existing `OpenRouter` credential.

```text
Using the n8n MCP server, create a workflow named "Lab C — Webhook triage (built by Claude)":

1. Webhook node: POST, path "triage-by-claude", respond using a "Respond to Webhook" node.
2. Edit Fields node "Config" with string fields: model = anthropic/claude-haiku-5.5,
   system_prompt = the contents of prompts/runtime/01-triage-classifier.md (the text inside the code block),
   schema_json = the contents of demo-1-deterministic-vs-agentic/schemas/triage.schema.json,
   text = {{ $json.body.text }}, email = {{ $json.body.email }}.
3. HTTP Request node "Classify with Claude": POST https://openrouter.ai/api/v1/chat/completions,
   authentication = predefined credential type "OpenRouter" (use the existing credential named OpenRouter),
   JSON body built with an expression: model, max_tokens 300, a system and a user message
   (user = '<request>\n' + text + '\n</request>'), response_format json_schema (strict, schema = JSON.parse(schema_json)),
   provider.require_parameters = true.
4. Edit Fields node "Parse JSON": triage (object) = {{ JSON.parse($json.choices[0].message.content) }}.
5. Respond to Webhook: JSON body = the triage object.

Add one sticky note explaining each step. Do NOT publish the workflow; leave it as a draft and give me its test URL.
```
