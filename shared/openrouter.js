// Tiny OpenRouter client shared by the seminar demos. No dependencies.
//
// OpenRouter exposes an OpenAI-compatible Chat Completions API, so Claude is called
// with "messages", "tools" and "response_format" in OpenAI shape. The concepts are the
// same as Anthropic's Messages API (see the README "Anthropic vs OpenRouter" table).
//
// Configuration comes from the repo-root .env (copy .env.example → .env).

import { readFileSync, existsSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url);
loadDotEnv(new URL('.env', ROOT));

export const config = {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  model: process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-5.5',
  agentModel: process.env.OPENROUTER_AGENT_MODEL || process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-5.5',
  priceIn: Number(process.env.PRICE_IN_PER_MTOK || 0),
  priceOut: Number(process.env.PRICE_OUT_PER_MTOK || 0),
};

export function requireApiKey() {
  if (!config.apiKey) {
    console.error('\nMissing OPENROUTER_API_KEY. In the repo root: cp .env.example .env  and paste your key.\n');
    process.exit(1);
  }
}

/**
 * POST /chat/completions. Returns { message, finishReason, usage, latencyMs, raw }.
 * Pass any Chat Completions fields (messages, tools, tool_choice, response_format, max_tokens...).
 */
export async function chat({ model = config.model, ...body }) {
  requireApiKey();
  const strictFeatures = body.response_format || body.tools;
  const t0 = performance.now();
  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${config.apiKey}`,
      'x-title': 'Agentic Automation Seminar',
    },
    body: JSON.stringify({
      model,
      ...body,
      // Only route to providers that really support structured outputs / tools for this model.
      ...(strictFeatures ? { provider: { require_parameters: true } } : {}),
    }),
  });
  const latencyMs = performance.now() - t0;
  const raw = await res.json().catch(() => ({}));
  if (!res.ok || raw.error) {
    const msg = raw?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`OpenRouter: ${msg} (model ${model})`);
  }
  const choice = raw.choices?.[0] ?? {};
  return {
    message: choice.message ?? {},
    finishReason: choice.finish_reason,
    usage: raw.usage ?? {},
    latencyMs,
    raw,
  };
}

/** Turn a JSON Schema into the OpenRouter / OpenAI response_format object. */
export function jsonSchemaFormat(name, schema) {
  return { type: 'json_schema', json_schema: { name, strict: true, schema } };
}

export function costUsd(usage = {}) {
  if (!config.priceIn && !config.priceOut) return null;
  return ((usage.prompt_tokens ?? 0) * config.priceIn + (usage.completion_tokens ?? 0) * config.priceOut) / 1e6;
}

export const color = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  magenta: (s) => `\x1b[35m${s}\x1b[0m`,
};

function loadDotEnv(url) {
  if (!existsSync(url)) return;
  for (const line of readFileSync(url, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[2] !== '' && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
