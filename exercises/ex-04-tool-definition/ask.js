// Exercise 4 — send ONE request with your tool definition and look at what comes back.
//   node exercises/ex-04-tool-definition/ask.js
//   node exercises/ex-04-tool-definition/ask.js --run       also run the tool and finish the loop
//   node exercises/ex-04-tool-definition/ask.js --tool <file>

import { readFileSync } from 'node:fs';
import { chat, config, color as c } from '../../shared/openrouter.js';

const args = process.argv.slice(2);
const toolPath = args.includes('--tool') ? args[args.indexOf('--tool') + 1] : new URL('starter/tool.json', import.meta.url).pathname;
const runIt = args.includes('--run');
const tool = JSON.parse(readFileSync(toolPath, 'utf8'));
const orders = JSON.parse(readFileSync(new URL('../../demo-5-ops-mcp-server/data/orders.json', import.meta.url), 'utf8'));

if (tool.function.name.startsWith('TODO')) {
  console.log(c.yellow('\nFill in starter/tool.json first (name, description, parameters).\n'));
  process.exit(1);
}

const messages = [
  { role: 'system', content: 'You are a customer-support agent. Use tools to check facts. Never invent order data.' },
  { role: 'user', content: 'Hi, where is my order 1042? I ordered it on November 10.' },
];

console.log(c.bold('\nExercise 4 — your tool definition'));
console.log(c.dim(`model: ${config.agentModel}\n`));
console.log(c.dim('Sent to Claude (tools[0]):'));
console.log(c.dim(JSON.stringify(tool, null, 2)) + '\n');

const r = await chat({ model: config.agentModel, max_tokens: 400, messages, tools: [tool], tool_choice: 'auto' });
console.log(`finish_reason: ${c.yellow(r.finishReason)}`);
const calls = r.message.tool_calls ?? [];
if (!calls.length) {
  console.log(c.red('Claude did not ask for your tool. Answer it gave:'));
  console.log('  ' + (r.message.content ?? '').trim());
  console.log(c.yellow('\nImprove the description: say WHEN to use it.\n'));
  process.exit(1);
}
for (const call of calls) {
  console.log(c.magenta('tool_call block:'));
  console.log(JSON.stringify(call, null, 2));
}

console.log(c.bold('\nQuestion for you: who runs this tool now? Write the answer down before you scroll on.'));

if (runIt) {
  const call = calls[0];
  const { order_id } = JSON.parse(call.function.arguments);
  const o = orders.find((x) => x.order_id === String(order_id));
  const output = o
    ? { found: true, status: o.status, carrier: o.carrier, tracking: o.tracking, delivered_at: o.delivered_at }
    : { found: false };
  console.log(c.cyan(`\n⚙ THIS SCRIPT ran ${call.function.name}(${order_id}) → ${JSON.stringify(output)}`));
  messages.push({ role: 'assistant', content: r.message.content ?? '', tool_calls: calls });
  messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(output) });
  const r2 = await chat({ model: config.agentModel, max_tokens: 300, messages, tools: [tool] });
  console.log(`\nfinish_reason: ${c.yellow(r2.finishReason)}`);
  if (r2.message.tool_calls?.length) {
    console.log(c.yellow('Claude asked for another tool call — a full agent would loop again (see Demo 3).\n'));
  } else {
    console.log(c.green('Claude: ') + (r2.message.content ?? '').trim() + '\n');
  }
} else {
  console.log(c.dim('Then run again with --run to see the answer.\n'));
}
