# Exercise 1 — Agentic or not?

**Module 1 · 8 minutes · in pairs · slide 10**

## Goal

Decide which processes deserve an AI agent and which should stay a plain workflow. You saw in Demo 1 that rules are fast, free and exact on predictable input, and that they break on messy input. Now apply that judgment to six real processes.

## What you do

1. Read the six process cards below.
2. Score each process on the **agentic-fit checklist**: 6 questions, each **0 = no, 1 = partly, 2 = yes**.
3. Use the two-step rule to pick an architecture.
4. Pick **one process you would NOT make agentic** and be ready to defend it in one sentence.

Use `worksheet.md` (or paper) for your answers.

## The checklist

**Part A — Input and complexity: do we *need* an LLM?**

| # | Question | 2 = yes when… |
| --- | --- | --- |
| Q1 | Is the input unstructured? | Free text, emails, PDFs, images, several languages |
| Q2 | Are there too many paths to write as rules? | Many intents, exceptions and edge cases; the rules would never end |

**Part B — Control and economics: is it *safe and worth it* to let the model decide?**

| # | Question | 2 = yes when… |
| --- | --- | --- |
| Q3 | Is a mistake reversible? | A wrong result can be undone cheaply (re-route, re-score, edit) |
| Q4 | Can a human review it? | There is a natural point for a person to check or approve |
| Q5 | Is volume × cost per run acceptable? | The value of each run is much higher than its token cost |
| Q6 | Can success be measured? | You can tell automatically, or quickly, whether the result was right |

## Pick the architecture (two steps)

**Step 1 — Need score = Q1 + Q2 (0–4)**

| Need | Architecture |
| --- | --- |
| 0–1 | **Rule-based workflow.** No LLM. Stop here |
| 2 | **Workflow + one LLM step** (classify or extract); everything else is deterministic |
| 3–4 | It *could* be agentic. Go to step 2 |

**Step 2 — Control score = Q3 + Q4 + Q5 + Q6 (0–8)**

| Control | Architecture |
| --- | --- |
| 0–3 | **Workflow + one LLM step.** The AI assists and a human decides |
| 4–6 | **LLM router** (Claude picks the branch, the workflow does the actions), with human approval before any write |
| 7–8 | **Agent with tools.** Human approval only for irreversible or high-value actions |

## The six process cards

**1. Refund requests.** Customers write by email or web form, in Hebrew or English, about damaged, late or wrong items. About 60 requests a week. Policy depends on item value, tier and timing. Refunds are paid by bank transfer.

**2. Invoice data entry.** About 400 supplier invoices a month arrive as PDFs and scans, each supplier with its own layout. Someone types supplier, date, amount, VAT and PO number into the ERP. Finance pays from the ERP.

**3. Password resets.** A user clicks "forgot password" in the portal. About 2,000 a month. Identity is checked with an email link.

**4. Contract review.** Legal receives about 8 supplier contracts a month, 20–40 pages each. A lawyer checks liability, payment terms and termination clauses before signing.

**5. Daily sales report.** Every morning at 08:00 managers get yesterday's sales by branch and product, from the sales database.

**6. Lead qualification.** About 300 leads a month come from a website contact form, events and LinkedIn messages. Sales wants each lead marked hot, warm or cold and routed to the right rep.

## Debrief (2 minutes, whole room)

- Which process scored highest? Which scored lowest?
- Where did pairs disagree, and on which question?
- Your "no": which process should **not** be agentic, and why?

## Bonus (5 minutes, if you finish early) — feel the rules break

Open `demo-1-deterministic-vs-agentic/src/rules-router.js` and try to make the keyword rules pass more of the 8 requests without breaking the ones that already pass:

```bash
cd demo-1-deterministic-vs-agentic
npm run demo:rules      # starts at 2/8 correct
```

Write down how many keywords you added, and what broke along the way.
