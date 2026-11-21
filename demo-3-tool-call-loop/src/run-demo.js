// Demo 3 — The tool-use loop, by hand, in ~60 lines of logic.
//
//   loop:
//     → send messages + tool definitions to Claude
//     ← Claude answers with tool_calls (finish_reason "tool_calls")  … or a final answer ("stop")
//     ⚙ YOUR code runs each requested tool
//     → append the results as role:"tool" messages with the same tool_call_id
//   until Claude stops asking for tools (or we hit MAX_ITERATIONS)
//
//   npm run demo                      run the loop
//   npm run demo -- --step            pause before every turn (press Enter) — best for presenting
//   npm run demo -- --question "..."  ask something else
//
// This is exactly what an n8n AI Agent node does internally, and what MCP standardises:
// with MCP, the "tool functions" live in an MCP server instead of in this file.

import { createInterface } from 'node:readline/promises';
import { chat, config, color as c } from '../../shared/openrouter.js';
import { toolDefinitions, toolFunctions } from './tools.js';

const args = process.argv.slice(2);
const pick = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
const stepMode = args.includes('--step');
const QUESTION = pick('--question') ?? 'My order 1042 arrived broken. Can I get my money back and keep the blender?';
const MAX_ITERATIONS = 5;
const model = config.agentModel;

const rl = stepMode ? createInterface({ input: process.stdin, output: process.stdout }) : null;
const pause = async (label) => {
  if (rl) await rl.question(c.dim(`   [Enter] ${label} `));
};

const messages = [
  {
    role: 'system',
    content:
      'You are a customer-support agent. Use the tools to check facts before answering: look up the order, then the ' +
      'policy. Never invent order data or policy. Answer in 2–3 short sentences and say which policy you applied.',
  },
  { role: 'user', content: QUESTION },
];

console.log(c.bold('\nDemo 3 — The tool-use loop'));
console.log(c.dim(`Model: ${model} via OpenRouter · tools: ${toolDefinitions.map((t) => t.function.name).join(', ')}`));
console.log(c.cyan(`User: "${QUESTION}"\n`));

let totalIn = 0;
let totalOut = 0;

for (let i = 1; i <= MAX_ITERATIONS; i++) {
  await pause(`send turn ${i} to Claude`);
  console.log(c.bold(`Turn ${i}`) + c.dim(`  → POST /chat/completions  (${messages.length} messages + ${toolDefinitions.length} tool definitions)`));

  const res = await chat({ model, max_tokens: 600, messages, tools: toolDefinitions, tool_choice: 'auto' });
  totalIn += res.usage.prompt_tokens ?? 0;
  totalOut += res.usage.completion_tokens ?? 0;
  const msg = res.message;
  const calls = msg.tool_calls ?? [];

  console.log(c.dim(`        ← finish_reason: `) + c.yellow(res.finishReason) + c.dim(`  · ${Math.round(res.latencyMs)} ms`));

  if (calls.length === 0) {
    console.log(c.green('\nClaude (final answer):'));
    console.log('  ' + (msg.content ?? '').trim().split('\n').join('\n  '));
    console.log(c.dim(`\n${i} turn(s) · ${totalIn} in / ${totalOut} out tokens`));
    console.log(c.dim('Claude never ran a tool. It asked; this script ran them and sent the results back.\n'));
    rl?.close();
    process.exit(0);
  }

  // Keep Claude's request in the history — the next turn must see what it asked for.
  messages.push({ role: 'assistant', content: msg.content ?? '', tool_calls: calls });

  if (calls.length > 1) console.log(c.magenta(`        Claude asked for ${calls.length} tools in parallel`));
  for (const call of calls) {
    const name = call.function.name;
    const input = JSON.parse(call.function.arguments || '{}');
    console.log(c.magenta(`        ← tool_call `) + c.bold(name) + c.dim(` ${JSON.stringify(input)}  id=${call.id}`));

    await pause(`run ${name} (your code, not Claude)`);
    const fn = toolFunctions[name];
    const output = fn ? fn(input) : { error: `Unknown tool ${name}` };
    console.log(c.cyan(`        ⚙ your code ran ${name} → `) + c.dim(JSON.stringify(output).slice(0, 140) + '…'));

    messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(output) });
    console.log(c.dim(`        → tool result added (tool_call_id=${call.id})`));
  }
  console.log('');
}

console.log(c.red(`Stopped after ${MAX_ITERATIONS} iterations — a guardrail every agent loop needs.\n`));
rl?.close();
