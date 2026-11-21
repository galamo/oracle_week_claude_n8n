// Demo 1 — Same requests, two routers: deterministic rules vs Claude.
//
//   npm run demo           live: rules + Claude for every request
//   npm run demo:rules     rules only (no API key needed)
//   npm run record         live run, and save Claude's answers to data/recorded-claude.json
//   npm run demo:offline   replay the recorded Claude answers (projector / no-wifi backup)
//
// Optional: node src/run-demo.js --only 3     run a single request by id

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { routeByRules } from './rules-router.js';
import { routeByClaude } from './claude-router.js';
import { config, requireApiKey, costUsd, color as c } from '../../shared/openrouter.js';

const root = new URL('..', import.meta.url);
const args = process.argv.slice(2);
const rulesOnly = args.includes('--rules-only');
const record = args.includes('--record');
const offline = args.includes('--offline');
const onlyIdx = args.indexOf('--only');
const onlyId = onlyIdx >= 0 ? Number(args[onlyIdx + 1]) : null;
const recordedPath = new URL('data/recorded-claude.json', root);

const requests = JSON.parse(readFileSync(new URL('data/requests.json', root), 'utf8')).filter(
  (r) => onlyId === null || r.id === onlyId
);

if (!rulesOnly && !offline) requireApiKey();
let recorded = {};
if (offline) {
  if (!existsSync(recordedPath)) {
    console.error('No recording yet. Run "npm run record" once while online.');
    process.exit(1);
  }
  recorded = JSON.parse(readFileSync(recordedPath, 'utf8'));
}

const mark = (ok) => (ok ? c.green('✔') : c.red('✘'));
console.log(c.bold('\nDemo 1 — Who chooses the path?'));
console.log(
  c.dim(`Rules: first keyword match wins (like an n8n Switch).  Claude: ${offline ? 'recorded answers' : config.model}\n`)
);

const totals = { rules: 0, claude: 0, claudeMs: 0, inTok: 0, outTok: 0, n: 0, answered: 0 };
const toSave = {};

for (const r of requests) {
  const rules = routeByRules(r.text);
  const rulesOk = rules.category === r.expected;
  totals.rules += rulesOk ? 1 : 0;
  totals.n += 1;

  console.log(c.bold(`#${r.id}  `) + c.cyan(`"${r.text}"`));
  console.log(
    `    rules   ${mark(rulesOk)} ${rules.category.padEnd(9)} ` +
      c.dim(rules.matched ? `matched "${rules.matched}"` : 'no keyword matched') +
      c.dim(`  · ${rules.latencyMs.toFixed(2)} ms · $0`)
  );

  if (!rulesOnly) {
    let out;
    try {
      out = offline ? recorded[r.id] : await routeByClaude(r.text);
    } catch (err) {
      console.log(c.red(`    claude  error: ${err.message}\n`));
      continue;
    }
    if (!out) {
      console.log(c.yellow('    claude  (no recorded answer for this request)\n'));
      continue;
    }
    toSave[r.id] = out;
    const ok = out.category === r.expected;
    totals.claude += ok ? 1 : 0;
    totals.answered += 1;
    totals.claudeMs += out.latencyMs ?? 0;
    totals.inTok += out.usage?.prompt_tokens ?? 0;
    totals.outTok += out.usage?.completion_tokens ?? 0;
    const human = out.needs_human ? c.yellow(' → human') : '';
    const category = String(out.category ?? 'unknown');
    const conf = Number.isFinite(Number(out.confidence)) ? Number(out.confidence).toFixed(2) : '?';
    console.log(
      `    claude  ${mark(ok)} ${category.padEnd(9)} ` +
        c.dim(`conf ${conf} · ${out.priority ?? '?'}`) +
        human +
        c.dim(`  · ${Math.round(out.latencyMs ?? 0)} ms`)
    );
    console.log(c.dim(`            ${out.summary ?? ''}`));
  }
  console.log(c.dim(`    expected: ${r.expected} — ${r.why}\n`));
}

console.log(c.bold('Scoreboard'));
console.log(`  Rules   ${totals.rules}/${totals.n} correct · ~0 ms · $0`);
if (!rulesOnly) {
  const cost = costUsd({ prompt_tokens: totals.inTok, completion_tokens: totals.outTok });
  const costTxt = cost === null ? 'set PRICE_* in .env to see cost' : `$${cost.toFixed(4)} total`;
  console.log(
    `  Claude  ${totals.claude}/${totals.n} correct · avg ${Math.round(totals.claudeMs / (totals.answered || 1))} ms · ` +
      `${totals.inTok} in / ${totals.outTok} out tokens · ${costTxt}`
  );
}
console.log(
  c.dim('\nTakeaway: keep rules where input is predictable; use Claude where input is messy — and gate risky actions with a human.\n')
);

if (record && !offline) {
  writeFileSync(recordedPath, JSON.stringify(toSave, null, 2));
  console.log(c.green('Saved Claude answers to data/recorded-claude.json (use: npm run demo:offline)\n'));
}
