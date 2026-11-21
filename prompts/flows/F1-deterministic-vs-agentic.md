# F1 — Deterministic vs agentic (Module 1, slide 5)

**Use:** paste `00-base-prompt.md` first, then this prompt, into Claude (or Claude Code) to get one self-contained HTML file.

```text
Flow: "Same request, two automations". Split the stage into two lanes, top = DETERMINISTIC (n8n Switch with 4 hard-coded rules: refund, shipping, invoice, other), bottom = AGENTIC (Claude classifier + tools). Phases: (1) a request arrives in both lanes: "my package came broken, I want my money back but keep the box?"; (2) top lane: keyword rules try refund -> match fails on mixed intent -> falls to "other" and lands in a red manual queue; (3) bottom lane: Claude reads it, returns JSON {category:"refund", sub:"damaged_item", confidence:0.91}, calls get_order tool, routes to refund branch with a green result; (4) second request that IS simple ("where is order 1042?") — both lanes succeed, top lane faster and cheaper, show cost badges ($0 vs ~$0.002) and latency badges. Final caption: "Use agents where inputs are messy; keep rules where they are not." 8 rail steps. Static strip: a 5-level spectrum from plain workflow to autonomous agent with level 2-4 highlighted.
```
