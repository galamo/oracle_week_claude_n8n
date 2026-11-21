// Exercise 0 — environment check. Run from the repo root:  node exercises/ex-00-environment-check/check.js
// Every line should end in ✔ before we start Module 2.

import { execSync } from 'node:child_process';
import { config, chat, color as c } from '../../shared/openrouter.js';

let failures = 0;
const ok = (label, detail = '') => console.log(`${c.green('✔')} ${label}${detail ? c.dim('  ' + detail) : ''}`);
const bad = (label, fix) => {
  failures++;
  console.log(`${c.red('✘')} ${label}\n    ${c.yellow('fix:')} ${fix}`);
};

console.log(c.bold('\nExercise 0 — Environment check\n'));

// 1. Node.js
const major = Number(process.versions.node.split('.')[0]);
major >= 22 ? ok('Node.js', `v${process.versions.node}`) : bad(`Node.js v${process.versions.node} is too old`, 'Install Node.js 24 LTS from nodejs.org');

// 2. Docker
try {
  const v = execSync('docker info --format "{{.ServerVersion}}"', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  ok('Docker is running', `server ${v}`);
} catch {
  bad('Docker is not running', 'Start Docker Desktop and wait until it says "Engine running"');
}

// 3. n8n
try {
  const res = await fetch('http://localhost:5678/healthz', { signal: AbortSignal.timeout(3000) });
  res.ok ? ok('n8n answers on http://localhost:5678') : bad(`n8n returned HTTP ${res.status}`, 'cd n8n && docker compose up -d');
} catch {
  bad('n8n is not reachable on localhost:5678', 'cd n8n && docker compose up -d   (then wait ~20 s)');
}

// 4. .env values
config.apiKey && !config.apiKey.endsWith('...')
  ? ok('OPENROUTER_API_KEY is set', `${config.apiKey.slice(0, 10)}…`)
  : bad('OPENROUTER_API_KEY is missing', 'cp .env.example .env  and paste your OpenRouter key');
process.env.MCP_TOKEN && !process.env.MCP_TOKEN.startsWith('change-me')
  ? ok('MCP_TOKEN is set')
  : bad('MCP_TOKEN is still the placeholder', 'Put a long random string in MCP_TOKEN in .env (e.g. openssl rand -hex 24)');

// 5. A real call to Claude through OpenRouter
if (config.apiKey) {
  try {
    const r = await chat({ max_tokens: 20, messages: [{ role: 'user', content: 'Reply with exactly: ready' }] });
    ok(
      `Claude answered: "${(r.message.content ?? '').trim()}"`,
      `${config.model} · ${r.usage.prompt_tokens} in / ${r.usage.completion_tokens} out tokens · ${Math.round(r.latencyMs)} ms`
    );
  } catch (err) {
    bad(`Claude call failed: ${err.message}`, 'Check the key, your OpenRouter credit, and OPENROUTER_MODEL at https://openrouter.ai/models');
  }
}

console.log(failures ? c.red(`\n${failures} problem(s) — fix them, then run again.\n`) : c.green('\nAll good. You are ready.\n'));
process.exit(failures ? 1 : 0);
