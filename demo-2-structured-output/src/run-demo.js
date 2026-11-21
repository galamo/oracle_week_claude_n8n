// Demo 2 — Structured output is the contract.
//
// One messy request, three ways of asking Claude, and a tiny "n8n Switch" that consumes the answer:
//   Round 1  just ask                       → friendly prose, the Switch gets nothing
//   Round 2  ask for JSON in the prompt     → usually parses... until it doesn't
//   Round 3  structured outputs (schema)    → always valid JSON, the Switch routes it
//
//   npm run demo                   all three rounds
//   npm run demo -- --round 3      one round
//   npm run demo -- --show-request also print the exact request body sent to OpenRouter
//   npm run demo -- --text "..."   your own request text

import { readFileSync } from 'node:fs';
import { chat, jsonSchemaFormat, config, color as c } from '../../shared/openrouter.js';

const here = new URL('..', import.meta.url);
const TRIAGE_PROMPT = readFileSync(new URL('triage.md', here), 'utf8');
const SCHEMA = JSON.parse(readFileSync(new URL('triage.schema.json', here), 'utf8'));

const args = process.argv.slice(2);
const pick = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
const onlyRound = pick('--round') ? Number(pick('--round')) : null;
const showRequest = args.includes('--show-request');
const TEXT =
  pick('--text') ?? 'My package came broken, I want my money back but can I keep the box? Order 1042. Honestly furious.';

// The "n8n Switch node": routes on $json.category and $json.confidence.
function n8nSwitch(json) {
  if (!json || typeof json !== 'object') return { output: null, why: 'input is not an object — execution fails' };
  if (json.needs_human || Number(json.confidence) < 0.7) return { output: 'human queue', why: 'needs_human / low confidence' };
  const routes = { refund: 'refunds team', shipping: 'logistics', billing: 'finance', technical: 'support L2', account: 'accounts' };
  return routes[json.category]
    ? { output: routes[json.category], why: `category = ${json.category}` }
    : { output: 'fallback', why: `unknown category "${json?.category}"` };
}

const rounds = [
  {
    n: 1,
    title: 'Just ask',
    body: {
      max_tokens: 300,
      messages: [
        { role: 'system', content: 'You are a helpful customer-support assistant.' },
        { role: 'user', content: `Classify this customer request:\n\n${TEXT}` },
      ],
    },
  },
  {
    n: 2,
    title: 'Ask for JSON in the prompt',
    body: {
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content:
            'You are a classifier. Reply in JSON with the fields category, priority, confidence, needs_human, summary, order_id.',
        },
        { role: 'user', content: TEXT },
      ],
    },
  },
  {
    n: 3,
    title: 'Structured outputs: response_format + JSON Schema',
    body: {
      max_tokens: 300,
      messages: [
        { role: 'system', content: TRIAGE_PROMPT },
        { role: 'user', content: `<request>\n${TEXT}\n</request>` },
      ],
      response_format: jsonSchemaFormat('triage', SCHEMA),
    },
  },
];

console.log(c.bold('\nDemo 2 — Structured output is the contract'));
console.log(c.dim(`Model: ${config.model} via OpenRouter`));
console.log(c.cyan(`Request: "${TEXT}"\n`));

for (const r of rounds) {
  if (onlyRound && r.n !== onlyRound) continue;
  console.log(c.bold(`── Round ${r.n}: ${r.title} ${'─'.repeat(Math.max(0, 50 - r.title.length))}`));
  if (showRequest) {
    const shown = { model: config.model, ...r.body };
    if (shown.response_format) shown.response_format = { ...shown.response_format, json_schema: { ...shown.response_format.json_schema, schema: '…triage.schema.json…' } };
    console.log(c.dim('POST https://openrouter.ai/api/v1/chat/completions'));
    console.log(c.dim(JSON.stringify(shown, null, 2).replace(TRIAGE_PROMPT, '…triage.md…')));
  }

  let res;
  try {
    res = await chat(r.body);
  } catch (err) {
    console.log(c.red(`  API error: ${err.message}\n`));
    continue;
  }
  const raw = res.message.content ?? '';
  console.log(c.dim('  Claude said:'));
  console.log('  ' + raw.trim().split('\n').join('\n  '));

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
    console.log(c.green('\n  JSON.parse  ✔ valid JSON'));
  } catch {
    console.log(c.red('\n  JSON.parse  ✘ ') + c.dim('not JSON (prose, a ```json fence, or extra text around it)'));
  }
  if (parsed) {
    const missing = SCHEMA.required.filter((k) => !(k in parsed));
    console.log(missing.length ? c.yellow(`  Schema      ✘ missing fields: ${missing.join(', ')}`) : c.green('  Schema      ✔ all required fields present'));
  }
  const route = n8nSwitch(parsed);
  console.log(
    (route.output ? c.green('  n8n Switch  → ') + c.bold(route.output) : c.red('  n8n Switch  ✘ ')) + c.dim(`  (${route.why})`)
  );
  console.log(c.dim(`  finish_reason=${res.finishReason} · ${res.usage.prompt_tokens ?? '?'} in / ${res.usage.completion_tokens ?? '?'} out tokens · ${Math.round(res.latencyMs)} ms\n`));
}

console.log(
  c.dim(
    'Takeaway: only round 3 is a contract. Still validate the meaning yourself — e.g. route low confidence to a human.\n'
  )
);
