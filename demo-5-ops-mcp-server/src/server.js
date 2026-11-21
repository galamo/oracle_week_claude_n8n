// Ops MCP server — Streamable HTTP on http://localhost:3200/mcp
//
// Built on the MCP TypeScript SDK v2 (spec 2026-07-28, stateless).
// createMcpHandler() serves modern 2026-07-28 clients AND falls back to stateless serving
// for older 2025-era clients (initialize handshake), so Cursor, Claude Desktop, n8n and
// MCP Inspector all work whatever protocol version they speak.

import { readFileSync, existsSync } from 'node:fs';
import express from 'express';
import { McpServer, createMcpHandler } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { registerTools } from './tools.js';

loadDotEnv(new URL('../../.env', import.meta.url)); // repo-root .env
loadDotEnv(new URL('../.env', import.meta.url)); // optional local override

const PORT = Number(process.env.MCP_PORT || 3200);
const TOKEN = process.env.MCP_TOKEN;
// localhost for Cursor / Claude Desktop / Inspector, host.docker.internal for n8n running in Docker.
// Add e.g. MCP_ALLOWED_HOSTS=localhost,127.0.0.1,host.docker.internal,.trycloudflare.com for a public tunnel (Demo 9).
const ALLOWED_HOSTS = (process.env.MCP_ALLOWED_HOSTS || 'localhost,127.0.0.1,host.docker.internal')
  .split(',')
  .map((h) => h.trim().toLowerCase());

if (!TOKEN || TOKEN.startsWith('change-me')) {
  console.error('Set MCP_TOKEN in the repo-root .env to a long random string first.');
  process.exit(1);
}

// One factory = one definition of the server, used for every request (stateless).
const factory = () => {
  const server = new McpServer({ name: 'ops-mcp', version: '1.0.0' });
  registerTools(server);
  return server;
};
const mcp = toNodeHandler(createMcpHandler(factory, { legacy: 'stateless', onerror: (e) => console.error('[mcp]', e.message) }));

const app = express();
app.use(express.json({ limit: '1mb' }));

// 1) DNS-rebinding protection: only accept known Host headers.
app.use((req, res, next) => {
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  // An entry starting with '.' allows a whole domain (e.g. .trycloudflare.com for a public tunnel, Demo 9).
  const ok = ALLOWED_HOSTS.some((h) => (h.startsWith('.') ? host.endsWith(h) : host === h));
  if (!ok) return res.status(403).json({ error: `Host ${host} not allowed` });
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true, server: 'ops-mcp', tools: 4 }));

// 2) Bearer auth on the MCP endpoint.
app.use('/mcp', (req, res, next) => {
  if (req.headers.authorization !== `Bearer ${TOKEN}`) {
    console.log(`${ts()} 401  ${req.method} /mcp  (missing or wrong bearer token)`);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// 3) Log what each request does. In 2026-07-28 the Mcp-Method / Mcp-Name headers say it
//    without parsing the body; for older clients we read the JSON-RPC body instead.
app.use('/mcp', (req, _res, next) => {
  const method = req.headers['mcp-method'] || req.body?.method || req.method;
  const name = req.headers['mcp-name'] || req.body?.params?.name || '';
  const era = req.headers['mcp-protocol-version'] || 'legacy';
  console.log(`${ts()} ${req.method.padEnd(4)} /mcp  ${String(method).padEnd(16)} ${String(name).padEnd(16)} [${era}]`);
  next();
});

app.all('/mcp', (req, res) => mcp(req, res, req.body));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\nops-mcp listening on http://localhost:${PORT}/mcp`);
  console.log(`From n8n in Docker use: http://host.docker.internal:${PORT}/mcp`);
  console.log('Tools: lookup_customer, get_order, search_kb (read) · create_ticket (write)\n');
});

function ts() {
  return new Date().toISOString().slice(11, 19);
}

function loadDotEnv(url) {
  if (!existsSync(url)) return;
  for (const line of readFileSync(url, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[2] !== '' && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
