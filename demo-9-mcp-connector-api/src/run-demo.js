// Demo 9 — Claude calls our MCP server by itself: Anthropic's MCP connector.
//
// One HTTP request to the Anthropic Messages API with `mcp_servers`. Anthropic's side connects to the MCP
// server, lists the tools, calls them and gives us the final answer. No MCP client, no tool loop in our code.
// Compare with Demo 3, where WE ran the loop.
//
//   npm run demo                        default question (order 1042)
//   npm run demo -- --question "..."    your own question
//   npm run demo -- --allow-write       also enable create_ticket (default: denylisted)
//   npm run demo -- --show-request      print the request body (token hidden)
//
// Needs (repo-root .env): ANTHROPIC_API_KEY, MCP_PUBLIC_URL (https tunnel to ops-mcp …/mcp), MCP_TOKEN.
// This feature is part of Anthropic's own API — OpenRouter's OpenAI-compatible API has no `mcp_servers` field.

import { readFileSync, existsSync } from 'node:fs';

loadDotEnv(new URL('../../.env', import.meta.url));

const args = process.argv.slice(2);
const pick = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
const QUESTION = pick('--question') ?? 'Customer dana.cohen@example.com says order 1042 arrived broken. Can she get a refund and keep the blender? Check the facts and the policy.';
const allowWrite = args.includes('--allow-write');
const showRequest = args.includes('--show-request');

const API_KEY = process.env.ANTHROPIC_API_KEY;
const BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
const MCP_URL = process.env.MCP_PUBLIC_URL;
const MCP_TOKEN = process.env.MCP_TOKEN;
const BETA = process.env.ANTHROPIC_MCP_BETA || 'mcp-client-2025-11-20';

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  magenta: (s) => `\x1b[35m${s}\x1b[0m`,
};

const missing = [
  !API_KEY && 'ANTHROPIC_API_KEY (Anthropic console key — this demo does not go through OpenRouter)',
  !MCP_URL && 'MCP_PUBLIC_URL (e.g. https://xyz.trycloudflare.com/mcp — see README step 2)',
  !MCP_TOKEN && 'MCP_TOKEN',
].filter(Boolean);
if (missing.length) {
  console.error(c.red('\nMissing in the repo-root .env:\n  - ' + missing.join('\n  - ') + '\n'));
  process.exit(1);
}
if (!MCP_URL.startsWith('https://')) {
  console.error(c.red('\nMCP_PUBLIC_URL must be https:// — Anthropic connects from the internet, localhost is not reachable.\n'));
  process.exit(1);
}

const body = {
  model: MODEL,
  max_tokens: 1200,
  system:
    'You are a customer-support agent. Use the ops-mcp tools to check the customer, the order and the policy before answering. ' +
    'Never invent data. Answer in 3 short sentences and name the policy article.',
  messages: [{ role: 'user', content: QUESTION }],
  mcp_servers: [{ type: 'url', url: MCP_URL, name: 'ops-mcp', authorization_token: MCP_TOKEN }],
  tools: [
    {
      type: 'mcp_toolset',
      mcp_server_name: 'ops-mcp',
      // Denylist: every tool is enabled except the write tool — read-only assistant.
      configs: allowWrite ? {} : { create_ticket: { enabled: false } },
    },
  ],
};

console.log(c.bold('\nDemo 9 — Anthropic MCP connector: Claude calls the MCP server itself'));
console.log(c.dim(`model ${MODEL} · beta ${BETA} · server ${MCP_URL} · create_ticket ${allowWrite ? c.yellow('ENABLED') : 'disabled (denylist)'}`));
console.log(c.cyan(`\nUser: "${QUESTION}"\n`));
if (showRequest) {
  const shown = JSON.parse(JSON.stringify(body));
  shown.mcp_servers[0].authorization_token = '***';
  console.log(c.dim('POST /v1/messages  anthropic-beta: ' + BETA));
  console.log(c.dim(JSON.stringify(shown, null, 2)) + '\n');
}

const t0 = performance.now();
const res = await fetch(`${BASE}/v1/messages`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': process.env.ANTHROPIC_VERSION || '2023-06-01',
    'anthropic-beta': BETA,
  },
  body: JSON.stringify(body),
});
const ms = Math.round(performance.now() - t0);
const data = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(c.red(`Anthropic API ${res.status}: ${data?.error?.message ?? JSON.stringify(data)}`));
  console.error(c.dim('Common causes: tunnel not running · wrong MCP_TOKEN (server returns 401) · host not in MCP_ALLOWED_HOSTS (403) · model id.'));
  process.exit(1);
}

let calls = 0;
for (const block of data.content ?? []) {
  if (block.type === 'mcp_tool_listing') {
    console.log(c.dim(`[tool listing from ${block.server_name ?? 'server'}]`));
  } else if (block.type === 'mcp_tool_use') {
    calls++;
    console.log(c.magenta('→ mcp_tool_use   ') + c.bold(block.name) + c.dim(`  ${JSON.stringify(block.input)}  (server: ${block.server_name})`));
  } else if (block.type === 'mcp_tool_result') {
    const text = (block.content ?? []).map((x) => x.text ?? '').join(' ').replace(/\s+/g, ' ');
    console.log((block.is_error ? c.red('← mcp_tool_result ✘ ') : c.cyan('← mcp_tool_result  ')) + c.dim(text.slice(0, 150) + (text.length > 150 ? '…' : '')));
  } else if (block.type === 'text') {
    console.log(c.green('\nClaude: ') + block.text.trim());
  }
}
console.log(
  c.dim(`\n${calls} MCP tool call(s) made by Anthropic · stop_reason ${data.stop_reason} · ` +
    `${data.usage?.input_tokens ?? '?'} in / ${data.usage?.output_tokens ?? '?'} out tokens · ${ms} ms`)
);
console.log(c.dim('Your code made ONE request. Watch the ops-mcp terminal: the tool calls came from Anthropic, through the tunnel.\n'));

function loadDotEnv(u) {
  if (!existsSync(u)) return;
  for (const line of readFileSync(u, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[2] !== '' && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
