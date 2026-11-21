// Test runner for Exercises 2 and 3. Run from the repo root:
//   node exercises/ex-02-classifier-schema/run.js                      → 5 normal inputs (Ex 2)
//   node exercises/ex-02-classifier-schema/run.js --break              → nasty inputs (Ex 3)
//   node exercises/ex-02-classifier-schema/run.js --prompt <file> --schema <file>   → test other files

import { readFileSync } from 'node:fs';
import { chat, jsonSchemaFormat, config, color as c } from '../../shared/openrouter.js';

const here = new URL('./', import.meta.url);
const args = process.argv.slice(2);
const pick = (flag, dflt) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : dflt);
const breakMode = args.includes('--break');

const promptPath = pick('--prompt', new URL('starter/prompt.md', here).pathname);
const schemaPath = pick('--schema', new URL('starter/schema.json', here).pathname);
const inputsPath = breakMode
  ? new URL('../ex-03-refusal-path/break-inputs.json', here).pathname
  : new URL('test-inputs.json', here).pathname;

const REQUIRED = ['category', 'priority', 'confidence', 'needs_human', 'summary', 'order_id'];
const CATEGORIES = ['refund', 'shipping', 'billing', 'technical', 'account', 'other', 'unknown'];

const prompt = readFileSync(promptPath, 'utf8');
let schema;
try {
  schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
} catch (e) {
  console.error(c.red(`\nYour schema is not valid JSON: ${e.message}\n`));
  process.exit(1);
}
const inputs = JSON.parse(readFileSync(inputsPath, 'utf8'));

console.log(c.bold(`\n${breakMode ? 'Exercise 3 — break it' : 'Exercise 2 — classifier with a JSON Schema'}`));
console.log(c.dim(`prompt: ${promptPath}\nschema: ${schemaPath}\nmodel:  ${config.model}\n`));

// 1. Check the schema itself before spending tokens.
const props = schema.properties ?? {};
const problems = [];
for (const k of REQUIRED) if (!props[k]) problems.push(`missing property "${k}"`);
if (!REQUIRED.every((k) => (schema.required ?? []).includes(k))) problems.push('"required" must list all six fields');
if (schema.additionalProperties !== false) problems.push('set "additionalProperties": false (structured outputs needs it)');
const enumCats = props.category?.enum ?? [];
if (!CATEGORIES.every((x) => enumCats.includes(x))) problems.push(`category enum must contain: ${CATEGORIES.join(', ')}`);
if (problems.length) {
  console.log(c.red('Schema check ✘'));
  for (const p of problems) console.log(c.yellow('  - ' + p));
  console.log(c.dim('\nFix starter/schema.json and run again.\n'));
  process.exit(1);
}
console.log(c.green('Schema check ✔  all six fields, required, enum, additionalProperties:false\n'));

// 2. Run every input.
let pass = 0;
for (const t of inputs) {
  process.stdout.write(c.cyan(`#${t.id} "${t.text || '(empty)'}"\n`));
  try {
    const r = await chat({
      max_tokens: 300,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `<request>\n${t.text}\n</request>` },
      ],
      response_format: jsonSchemaFormat('triage', schema),
    });
    const out = JSON.parse(r.message.content);
    const catOk = out.category === t.expected;
    const humanOk = t.needs_human === undefined || out.needs_human === t.needs_human;
    const ok = catOk && humanOk;
    pass += ok ? 1 : 0;
    console.log(
      `   ${ok ? c.green('✔') : c.red('✘')} category=${out.category} (expected ${t.expected}) · priority=${out.priority} · ` +
        `confidence=${out.confidence} · needs_human=${out.needs_human}${humanOk ? '' : c.red(` (expected ${t.needs_human})`)}`
    );
    console.log(c.dim(`     summary: ${out.summary}${out.order_id ? ` · order_id: ${out.order_id}` : ''}`));
  } catch (err) {
    console.log(c.red(`   ✘ ${err.message}`));
  }
}

console.log(c.bold(`\n${pass}/${inputs.length} passed`));
console.log(
  pass === inputs.length
    ? c.green(breakMode ? 'Done: Claude says "unknown" instead of inventing.\n' : 'Done: every input returns schema-valid JSON with the right category.\n')
    : c.yellow(breakMode ? 'Improve the "way out" rules in your prompt and run again.\n' : 'Tune your prompt (rules, definitions) and run again.\n')
);
