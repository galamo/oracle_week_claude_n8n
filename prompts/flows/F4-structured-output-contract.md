# F4 — Structured output contract (Module 2, slide 13)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Flow: "Structured output is the contract between Claude and n8n". Left: incoming ticket text. Middle: Claude with a JSON Schema card (category enum, priority enum, confidence number 0-1, needs_human boolean, summary string). Right: an n8n Switch node with 4 outputs. Phase A (without schema): Claude returns friendly prose "Sure! This looks like a refund..." -> parser turns red, Switch receives undefined, execution fails. Phase B (with structured outputs): a schema grid overlays the generation, tokens snap into fields, valid JSON slides out, each field lights the matching Switch output; confidence 0.62 < 0.7 lights the "human review" branch. Phase C: strict tool use: tool input validated with a green check. Caption the difference between JSON outputs (Anthropic output_config.format / OpenRouter response_format json_schema) and strict tool use. Static strip: schema -> JSON -> Switch.
```
