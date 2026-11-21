---
name: agentic-fit-check
description: Decide whether a business process should be automated with rules, one LLM step, an LLM router or an AI agent, using the seminar's two-step Need/Control scoring. Use when the user asks "should this be agentic?", "is this a good use case for an AI agent?", or wants to evaluate a process for automation.
---

# Agentic-fit check

Score one business process (or a list of them) and recommend an architecture, the main risk, the guardrails and a rough cost. The method matches Exercise 1 of the seminar.

## Steps

1. **Understand the process.** If these facts are missing, ask at most 3 short questions:
   - what the input looks like (form, email, PDF, database rows…), and the languages
   - volume (runs per day or month) and what one mistake costs
   - what happens with the result (a write, a payment, a reply, a report) and whether a person can check it
2. **Score 6 questions**, each **0 = no, 1 = partly, 2 = yes**, with one line of reason:

| # | Part | Question | 2 = yes when |
|---|---|---|---|
| Q1 | Need | Is the input unstructured? | free text, documents, images, several languages |
| Q2 | Need | Too many paths to write as rules? | many intents, exceptions, edge cases |
| Q3 | Control | Is a mistake reversible? | a wrong result is cheap to undo |
| Q4 | Control | Can a human review it? | there is a natural approval or check point |
| Q5 | Control | Is volume × cost per run acceptable? | the value per run is far above the token cost |
| Q6 | Control | Can success be measured? | correctness can be checked automatically or quickly |

3. **Decide in two steps:**
   - **Need = Q1 + Q2**
     - 0–1 → **Rule-based workflow** (no LLM). Stop here.
     - 2 → **Workflow + one LLM step** (classify or extract into a strict schema; the rest is deterministic)
     - 3–4 → go to Control
   - **Control = Q3 + Q4 + Q5 + Q6**
     - 0–3 → **Workflow + one LLM step**: the AI assists and a human decides
     - 4–6 → **LLM router** (the model picks the branch, the workflow acts), with human approval before any write
     - 7–8 → **Agent with tools**; human approval only for irreversible or high-value actions
4. **Name the main risk** in one sentence: the thing that hurts most if the model is wrong.
5. **Suggest guardrails** that fit the architecture:
   - structured output for every decision
   - a route to a human for low confidence or `unknown`
   - read-only tools for agents, writes behind approval
   - max iterations, token and timeout limits
   - an audit log and an error workflow
6. **Rough cost per 1,000 runs** = 1,000 × (input + output tokens per run) × price per token. State the assumptions: tokens per run and the model price. If the price isn't known, give the formula and say what to plug in. Don't invent prices.

## Output format

```markdown
## Agentic-fit check — <process>

| Q | Score | Why |
|---|---|---|
| Q1 Unstructured input | 2 | free-text emails in Hebrew and English |
| … | … | … |
| **Need** | **4** | |
| **Control** | **7** | |

**Recommendation:** <architecture> — <one sentence why>
**Main risk:** <one sentence>
**Guardrails:** <3–5 bullets>
**Cost:** ~<n> tokens/run × <price> → ~$<x> per 1,000 runs (assumptions: …)
**Not agentic if:** <the condition that would flip the decision>
```

## Calibration examples

| Process | Need | Control | Result |
| --- | --- | --- | --- |
| Refund requests (email, mixed intents) | 4 | 7 | Agent with tools + approval before paying |
| Invoice data entry (PDF layouts vary, one path) | 2 | — | Workflow + one LLM extraction step |
| Password resets | 0 | — | Rule-based |
| Contract review (legal, irreversible) | 4 | 3 | AI assists, a lawyer decides |
| Daily sales report from a database | 0 | — | Rule-based (optionally one LLM step for a written summary) |
| Lead qualification | 3 | 8 | Agent with tools, spot checks |

Push back when a request is agentic for its own sake. "Messy input" alone justifies one LLM step, not an agent.
