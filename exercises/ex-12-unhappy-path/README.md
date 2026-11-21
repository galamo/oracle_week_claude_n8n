# Exercise 12 — The unhappy path: retries and an error workflow

**Module 5 · 10 minutes · Lab D part 3 · slide 42**

## Goal

Make Lab D survive a broken dependency. Retry the calls that can fail, and when it still fails, **tell someone** instead of failing silently.

## Steps

1. Start from your Lab D workflow from Exercise 11. Didn't finish? Ask the lecturer for the checkpoint file.
2. **Retries:** on **Classify with Claude**, **Triage agent** and **create_ticket (ops-mcp)**, open Settings and turn on **Retry On Fail** (Max Tries 3, Wait Between Tries 2000 ms).
3. **Error workflow:** create a new workflow:
   - **Error Trigger** → **Data Table** insert into `alerts`:
     `workflow` = `{{ $json.workflow.name }}`, `node` = `{{ $json.execution.lastNodeExecuted }}`, `message` = `{{ $json.execution.error.message }}`, `execution_id` = `{{ $json.execution.id }}`, `url` = `{{ $json.execution.url }}`
   - Optional: a Telegram or Slack node that sends the same message.
   - **Publish it.** An unpublished error workflow is never called.
4. In Lab D → **Workflow settings → Error workflow** → choose your new workflow. Save and publish Lab D.
5. Break it: **stop the ops MCP server** (`Ctrl+C`) and send the refund request again.
6. Start the server again and send it once more.

## Done when

- With the server stopped: Lab D fails after its retries, and a row appears in `alerts` with the workflow name, the failing node and the execution id.
- With the server running again: the same request works normally.

## Think about

Which nodes should **not** retry? (Hint: what happens if `create_ticket` succeeded but the response got lost?)
