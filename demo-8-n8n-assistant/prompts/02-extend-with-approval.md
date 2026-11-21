# Prompt 2 — Iterate: add a human approval

Type into the same Assistant chat, after Prompt 1:

```text
Change the "accepted" branch: when the category is refund, do not accept automatically.
Instead, respond to the webhook with {"status":"pending_approval"} and a link to an approval form,
then wait for a person to choose Approve or Reject in that form (add a note field too).
Approve → set status "approved", Reject → set status "rejected", and keep the note.
All other categories stay as they are.

Do not publish. Run it once with the refund test request, give me the form link, and tell me
which node waits for the human.
```

**What to point at:** the Assistant picks a Wait node with a form, the same human-in-the-loop pattern as Lab D, built from one sentence.
