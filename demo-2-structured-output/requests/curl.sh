#!/usr/bin/env bash
# Send a raw request file to OpenRouter with curl — the same HTTP call an n8n HTTP Request node makes.
#   bash requests/curl.sh 1-free-text.json
#   bash requests/curl.sh 2-structured.json
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f ../../.env ] && . ../../.env; set +a
: "${OPENROUTER_API_KEY:?Set OPENROUTER_API_KEY in the repo-root .env}"
MODEL="${OPENROUTER_MODEL:-anthropic/claude-haiku-5.5}"
sed "s#__MODEL__#${MODEL}#" "${1:?request file}" |
  curl -sS https://openrouter.ai/api/v1/chat/completions \
    -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
    -H "Content-Type: application/json" \
    --data-binary @- |
  { command -v jq >/dev/null && jq '{content: .choices[0].message.content, finish_reason: .choices[0].finish_reason, usage}' || cat; }
