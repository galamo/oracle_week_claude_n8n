// The tools Claude may ask for. Each has TWO parts:
//   1. a definition (name, description, JSON Schema) that is SENT to the model
//   2. a function that YOUR code runs when the model asks for it
// Claude never runs these — it only returns "please call get_order with {order_id: '1042'}".
// The data is the same fictional data the ops MCP server (Demo 5) serves.

import { readFileSync } from 'node:fs';

const dataDir = new URL('../../demo-5-ops-mcp-server/data/', import.meta.url);
const orders = JSON.parse(readFileSync(new URL('orders.json', dataDir), 'utf8'));
const kb = JSON.parse(readFileSync(new URL('kb.json', dataDir), 'utf8'));

export const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'get_order',
      description:
        'Get one order by its id. Use when the request mentions an order number. Returns status, items, dates and total. ' +
        'Read-only. Returns {found:false} if the id does not exist — never retry with guessed ids.',
      parameters: {
        type: 'object',
        properties: { order_id: { type: 'string', description: 'Order number, digits only, e.g. 1042' } },
        required: ['order_id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_policy',
      description:
        'Search the support policy knowledge base for the rule that applies (refunds, returns, shipping, escalation). ' +
        'Read-only. Returns up to 3 articles; an empty list means no policy was found.',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string', description: 'Keywords, e.g. "keep damaged item refund"' } },
        required: ['query'],
        additionalProperties: false,
      },
    },
  },
];

export const toolFunctions = {
  get_order: ({ order_id }) => {
    const o = orders.find((x) => x.order_id === String(order_id));
    return o ? { found: true, order: o } : { found: false };
  },
  search_policy: ({ query }) => {
    const words = String(query).toLowerCase().split(/\W+/).filter((w) => w.length > 2);
    const articles = kb
      .map((a) => ({ a, score: words.filter((w) => `${a.title} ${a.body}`.toLowerCase().includes(w)).length }))
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, 3)
      .map((x) => ({ article_id: x.a.article_id, title: x.a.title, body: x.a.body }));
    return { count: articles.length, articles };
  },
};
