# Prompt 2 — Build the Lab C triage workflow

Paste into Claude Code from the **repo root** (so it can read the prompt and schema files):

```text
Using the n8n-instance MCP tools, create a NEW workflow named "Demo 7 — Triage built by Claude".

Read these two files from this repo first and use their exact contents:
- prompts/runtime/01-triage-classifier.md  → the system prompt is the text inside the ```text block
- demo-1-deterministic-vs-agentic/schemas/triage.schema.json → the JSON Schema

Build these nodes, connected in this order:
1. Webhook — POST, path "demo7-triage", response mode "Using 'Respond to Webhook' node".
2. Edit Fields "Config" — string fields:
   model = anthropic/claude-haiku-5.5, system_prompt = <the prompt>, schema_json = <the schema JSON as a string>,
   text = {{ $json.body.text }}, email = {{ $json.body.email }}
3. HTTP Request "Classify with Claude" — POST https://openrouter.ai/api/v1/chat/completions,
   Authentication: predefined credential type "OpenRouter", using my existing credential named "OpenRouter"
   (do not create a new credential, do not put any key in the node).
   JSON body as an expression that returns JSON.stringify of:
   { model, max_tokens: 300,
     messages: [ {role:'system', content: system_prompt}, {role:'user', content: '<request>\n' + text + '\n</request>'} ],
     response_format: { type:'json_schema', json_schema: { name:'triage', strict:true, schema: JSON.parse(schema_json) } },
     provider: { require_parameters: true } }
   Settings: retry on fail, 3 tries, 2000 ms between tries. Timeout 30 s.
4. Edit Fields "Parse JSON" — field triage (type Object) = {{ JSON.parse($json.choices[0].message.content) }}
5. Respond to Webhook — respond with JSON: {{ JSON.stringify($json.triage) }}

Add one sticky note that explains the flow in 4 lines.

Rules:
- Do NOT publish/activate the workflow. Leave it as a draft.
- When done, give me: the workflow name, its id, the test URL
  (http://localhost:5678/webhook-test/demo7-triage), and a curl command to test it with
  {"text":"My order 1042 arrived broken, I want my money back","email":"dana.cohen@example.com"}.
- If any node type or parameter is not accepted, tell me exactly what you changed instead of guessing silently.
```

**Expected result:** a workflow equivalent to `solutions/ex-08-webhook-classify/solution.workflow.json`. Open it in the editor, click **Execute workflow**, and run the curl command Claude gave you.
