# F7 — n8n items and expressions (Module 4, slide 32)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Flow: "How data moves through n8n". A horizontal n8n-style canvas with rounded nodes: Webhook -> Edit Fields -> HTTP Request (Claude) -> Switch -> Data Table. Items are small cards stacked like a deck (show 3 items). Phases: webhook receives an array of 3 requests -> splits into 3 items; Edit Fields maps body.text to prompt via expression; zoom into the expression editor where {{ $json.body.text }} resolves live to the actual value; HTTP Request runs once per item (3 calls, counter); Switch sends items to different outputs by {{ $json.category }}; one item has a missing field -> show the expression resolving to undefined and the fix with ?? 'n/a'. Also show $('Webhook').item.json referencing an earlier node, and a warning chip "after a Wait node use .first()". Final caption: "Every node runs once per item." Static strip: item structure { json, binary } and the 3 most-used expressions.
```
