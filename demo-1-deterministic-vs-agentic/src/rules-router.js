// Deterministic router: the same logic an n8n Switch node with "contains" rules would run.
// Rules are checked top to bottom and the FIRST match wins, exactly like a Switch node
// with "Send data to all matching outputs" turned off.

export const RULES = [
  { category: 'shipping', keywords: ['where is', 'tracking', 'delivery', 'package', 'shipped'] },
  { category: 'account', keywords: ['login', 'log in', 'password', 'email address'] },
  { category: 'refund', keywords: ['refund', 'money back', 'return'] },
  { category: 'billing', keywords: ['invoice', 'charged', 'payment', 'bill'] },
  { category: 'technical', keywords: ['error', 'bug', 'crash', 'not working'] },
];

export function routeByRules(text) {
  const t0 = performance.now();
  const lower = text.toLowerCase();
  let category = 'other';
  let matched = null;
  for (const rule of RULES) {
    const hit = rule.keywords.find((k) => lower.includes(k));
    if (hit) {
      category = rule.category;
      matched = hit;
      break;
    }
  }
  return { category, matched, latencyMs: performance.now() - t0 };
}
