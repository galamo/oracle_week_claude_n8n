// Smoke test: connect with the official MCP client (SDK v2), list tools, call each read tool.
//   npm test                 (server must be running: npm start) — 2025-11-25 style (initialize + session-less)
//   npm run test:modern      — negotiate the 2026-07-28 stateless protocol (server/discover, Mcp-Method headers)
// Uses MCP_TOKEN and MCP_PORT from the repo-root .env.

import { readFileSync, existsSync } from 'node:fs';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';

loadDotEnv(new URL('../../.env', import.meta.url));
const url = new URL(`http://localhost:${process.env.MCP_PORT || 3200}/mcp`);
const token = process.env.MCP_TOKEN;

const modern = process.argv.includes('--modern');
const client = new Client(
  { name: 'smoke-test', version: '1.0.0' },
  modern ? { versionNegotiation: { mode: 'auto' } } : undefined
);
console.log(`Connecting to ${url} (${modern ? '2026-07-28 negotiation' : 'legacy 2025-11-25 handshake'})`);
const transport = new StreamableHTTPClientTransport(url, {
  requestInit: { headers: { Authorization: `Bearer ${token}` } },
});
await client.connect(transport);

const { tools } = await client.listTools();
console.log('tools/list →', tools.map((t) => t.name).join(', '));

const show = async (name, args) => {
  const res = await client.callTool({ name, arguments: args });
  const out = res.structuredContent ?? JSON.parse(res.content[0].text);
  console.log(`\ntools/call ${name} ${JSON.stringify(args)}\n`, JSON.stringify(out).slice(0, 300));
};

await show('get_order', { order_id: '1042' });
await show('lookup_customer', { customer_id: 'C-1001' });
await show('search_kb', { query: 'damaged item refund', category: 'refund' });
await show('get_order', { order_id: '9999' });

await client.close();
console.log('\nOK — server answers over Streamable HTTP.');

function loadDotEnv(u) {
  if (!existsSync(u)) return;
  for (const line of readFileSync(u, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[2] !== '' && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
