// The four ops tools. Each tool = name + description (a prompt for the model!) + strict
// input schema + handler. Read tools are marked readOnlyHint; the write tool says it
// needs human approval so hosts (and n8n) can gate it.

import { readFileSync, writeFileSync } from 'node:fs';
import { z } from 'zod';

const dataDir = new URL('../data/', import.meta.url);
const load = (f) => JSON.parse(readFileSync(new URL(f, dataDir), 'utf8'));
const customers = load('customers.json');
const orders = load('orders.json');
const kb = load('kb.json');
const ticketsFile = new URL('tickets.json', dataDir);

const CATEGORIES = ['refund', 'shipping', 'billing', 'technical', 'account', 'other'];

/** Helper: return the same object as text (for every client) and as structuredContent. */
const result = (obj) => ({ content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }], structuredContent: obj });

export function registerTools(server) {
  server.registerTool(
    'lookup_customer',
    {
      title: 'Look up customer',
      description:
        'Find one customer by email address or customer id (C-1001 format). Use before deciding on refunds or ' +
        'exceptions, to know the customer tier and open tickets. Read-only. Returns {found:false} if there is no match — ' +
        'never guess or retry with invented values.',
      inputSchema: z.object({
        email: z.string().email().optional().describe('Customer email address'),
        customer_id: z.string().regex(/^C-\d{4}$/).optional().describe('Customer id, e.g. C-1001'),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ email, customer_id }) => {
      if (!email && !customer_id) return result({ found: false, error: 'Provide email or customer_id' });
      const c = customers.find(
        (x) => (email && x.email.toLowerCase() === email.toLowerCase()) || (customer_id && x.customer_id === customer_id)
      );
      return result(c ? { found: true, customer: c } : { found: false });
    }
  );

  server.registerTool(
    'get_order',
    {
      title: 'Get order',
      description:
        'Get one order by its id. Use when the request mentions an order number. Returns status, items, dates, ' +
        'total, carrier and tracking, plus the customer_id. Read-only. Returns {found:false} if the id does not exist — ' +
        'never retry with guessed ids.',
      inputSchema: z.object({
        order_id: z.string().regex(/^\d{4,8}$/).describe('Order number, digits only, e.g. 1042'),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ order_id }) => {
      const o = orders.find((x) => x.order_id === order_id);
      return result(o ? { found: true, order: o } : { found: false });
    }
  );

  server.registerTool(
    'search_kb',
    {
      title: 'Search policy knowledge base',
      description:
        'Search the support policy knowledge base. Use it to find the rule that applies before proposing an action ' +
        '(refund limits, shipping times, escalation rules). Optionally filter by category. Read-only. Returns up to 3 ' +
        'articles; an empty list means no policy found — say so instead of inventing one.',
      inputSchema: z.object({
        query: z.string().min(2).describe('Keywords, e.g. "damaged item refund"'),
        category: z.enum(CATEGORIES).optional(),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ query, category }) => {
      const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
      const scored = kb
        .filter((a) => !category || a.category === category)
        .map((a) => {
          const hay = `${a.title} ${a.body}`.toLowerCase();
          return { a, score: words.filter((w) => hay.includes(w)).length };
        })
        .filter((x) => x.score > 0)
        .sort((x, y) => y.score - x.score)
        .slice(0, 3)
        .map((x) => x.a);
      return result({ count: scored.length, articles: scored });
    }
  );

  server.registerTool(
    'create_ticket',
    {
      title: 'Create support ticket',
      description:
        'WRITE ACTION — requires human approval before calling. Creates a support ticket for a customer. Call only ' +
        'after you looked up the customer and the policy, and only when the policy requires a ticket. Returns the new ' +
        'ticket id.',
      inputSchema: z.object({
        customer_id: z.string().regex(/^C-\d{4}$/),
        category: z.enum(CATEGORIES),
        priority: z.enum(['high', 'medium', 'low']),
        summary: z.string().min(5).max(200),
        order_id: z.string().regex(/^\d{4,8}$/).optional(),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (input) => {
      if (!customers.some((c) => c.customer_id === input.customer_id)) {
        return { ...result({ created: false, error: `Unknown customer ${input.customer_id}` }), isError: true };
      }
      const tickets = JSON.parse(readFileSync(ticketsFile, 'utf8'));
      const ticket = {
        ticket_id: `T-${String(tickets.length + 1).padStart(4, '0')}`,
        status: 'open',
        created_at: new Date().toISOString(),
        ...input,
      };
      tickets.push(ticket);
      writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
      return result({ created: true, ticket });
    }
  );
}
