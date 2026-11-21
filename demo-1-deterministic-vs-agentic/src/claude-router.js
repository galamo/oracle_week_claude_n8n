// Agentic router: Claude (via OpenRouter) classifies the request and returns JSON that
// is guaranteed to match schemas/triage.schema.json (structured outputs).
// It is one HTTP call — the same call an n8n HTTP Request node makes.

import { readFileSync } from 'node:fs';
import { chat, jsonSchemaFormat } from '../../shared/openrouter.js';

const root = new URL('..', import.meta.url);
const SYSTEM_PROMPT = readFileSync(new URL('prompts/triage.md', root), 'utf8');
const SCHEMA = JSON.parse(readFileSync(new URL('schemas/triage.schema.json', root), 'utf8'));

function contentText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map((part) => (typeof part === 'string' ? part : part?.text ?? '')).join('');
  }
  return '';
}

export async function routeByClaude(text, { model, maxTokens = 300 } = {}) {
  const { message, usage, latencyMs, finishReason } = await chat({
    model,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `<request>\n${text}\n</request>` },
    ],
    response_format: jsonSchemaFormat('triage', SCHEMA),
  });
  const raw = contentText(message.content).trim();
  if (!raw) {
    throw new Error(`empty response (finish_reason=${finishReason ?? 'unknown'})`);
  }
  const result = JSON.parse(raw);
  if (!result?.category) {
    throw new Error('response missing required field "category"');
  }
  return { ...result, latencyMs, usage, finishReason };
}
