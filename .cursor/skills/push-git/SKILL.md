---
name: push-git
description: Stages all content, commits with CURRENT_TIMESTAMP_GAL, and pushes origin HEAD. Use only when the user explicitly calls push-git or /push-git.
disable-model-invocation: true
---

# Push Git (`push-git`)

When the user explicitly calls `push-git` or `/push-git`, run **exactly** these three operations in order. Do not do anything else.

## Workflow

1. **git add all the content**

```bash
git add -A
```

2. **git commit -m CURRENT_TIMESTAMP_GAL**

- Message format: `<current_timestamp>_GAL`
- `current_timestamp`: local datetime as `YYYYMMDDHHMMSS` (e.g. `20261122153400`)
- Example message: `20261122153400_GAL`
- Pass the message via HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
20261122153400_GAL
EOF
)"
```

Replace the example timestamp with the actual current timestamp before running.

3. **git push origin head**

```bash
git push origin HEAD
```

## End reply

After the three operations finish, write exactly:

```
SKILL_GIT_PUSH_RUN
```

## Rules

- Do **only** the three operations above, then write `SKILL_GIT_PUSH_RUN`
- Do **not** amend, force-push, skip hooks, or update git config
- Do **not** summarize changes, ask questions, or run extra git commands
