import MenuItem from '../models/MenuItem.js';

const API_URL = 'https://api.anthropic.com/v1/messages';

const buildSystemPrompt = async () => {
  const items = await MenuItem.find({ available: true }).lean();
  const menu = items
    .map(
      (i) =>
        `- ${i.name} (${i.category}) $${i.price.toFixed(2)} — ${i.description || ''} [${(i.dietary || []).join(', ') || 'no tags'}]`
    )
    .join('\n');

  return `You are "Spoon", the friendly assistant for Urban Spoon Restaurant.
Answer briefly (max 3 sentences), warm tone, light emoji use.
You can help with: menu questions, dietary advice, recommendations, opening hours, table booking, delivery info.
Facts:
- Hours: Mon–Fri 11:00–22:00, Sat–Sun 09:00–23:00.
- Free delivery over $25. Delivery ~30 minutes. Support 24/7.
- Table booking: tell the user to click "Book a Table" on the site.
- First order code: WELCOME20 (20% off, orders over $20).
Menu:
${menu}
Only recommend items on this menu. If you do not know something, suggest calling the restaurant. Never invent prices.`;
};

// Rule-based fallback so the widget still works with no API key / on API failure.
const fallbackReply = async (message) => {
  const t = message.toLowerCase();
  if (/(book|table|reserve)/.test(t)) return 'Happy to help! Tap "Book a Table" on the site and pick a date and time. 📅';
  if (/(hour|open|close|time)/.test(t)) return 'We are open Mon–Fri 11am–10pm and Sat–Sun 9am–11pm. 🕐';
  if (/(deliver|track|order)/.test(t)) return 'We deliver in about 30 minutes, free over $25. 🚚';
  if (/(offer|discount|code|coupon)/.test(t)) return 'Use code WELCOME20 for 20% off your first order over $20! 🎉';
  const cats = ['pizza', 'chicken', 'drinks', 'desserts', 'sides'];
  const cat = cats.find((c) => t.includes(c)) || (t.includes('burger') ? 'chicken' : null);
  if (cat || /(menu|food|eat|recommend|suggest)/.test(t)) {
    const items = await MenuItem.find(cat ? { category: cat } : {}).sort({ popularity: -1 }).limit(3).lean();
    if (items.length)
      return `Popular picks: ${items.map((i) => `${i.name} ($${i.price.toFixed(2)})`).join(', ')}. 🍽️`;
  }
  return 'Thanks for your message! For anything else, call us or message us on WhatsApp. 😊';
};

export const generateReply = async (history, message) => {
  if (!process.env.ANTHROPIC_API_KEY) return { reply: await fallbackReply(message), source: 'fallback' };

  try {
    const messages = [
      ...history.slice(-10).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: message },
    ];

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
        max_tokens: 300,
        system: await buildSystemPrompt(),
        messages,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`AI API ${res.status}`);
    const data = await res.json();
    const reply = data.content?.find((b) => b.type === 'text')?.text?.trim();
    if (!reply) throw new Error('Empty AI reply');
    return { reply, source: 'ai' };
  } catch (err) {
    console.error('AI service error:', err.message);
    return { reply: await fallbackReply(message), source: 'fallback' };
  }
};

// AI feature: personalised dish recommendations from a free-text preference.
export const recommendDishes = async (preference) => {
  const items = await MenuItem.find({ available: true }).lean();
  if (!process.env.ANTHROPIC_API_KEY) {
    const t = preference.toLowerCase();
    const scored = items
      .map((i) => ({
        i,
        s: [i.name, i.description, i.category, ...(i.dietary || [])].join(' ').toLowerCase().split(/\W+/).filter((w) => w.length > 2 && t.includes(w)).length + i.popularity / 1000,
      }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3);
    return scored.map(({ i }) => ({ id: i._id, name: i.name, reason: 'Matches your taste and is popular with our guests.' }));
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
        max_tokens: 500,
        system:
          'You recommend dishes from the given menu. Respond ONLY with a JSON array of up to 3 objects {"id": string, "reason": string (max 15 words)}. No prose, no code fences.',
        messages: [
          {
            role: 'user',
            content: `Menu:\n${items.map((i) => `${i._id} | ${i.name} | ${i.category} | $${i.price} | ${i.description} | ${(i.dietary || []).join(',')}`).join('\n')}\n\nGuest preference: ${preference}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`AI API ${res.status}`);
    const data = await res.json();
    const text = data.content?.find((b) => b.type === 'text')?.text || '[]';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    const byId = new Map(items.map((i) => [String(i._id), i]));
    return parsed
      .filter((r) => byId.has(String(r.id)))
      .map((r) => ({ id: r.id, name: byId.get(String(r.id)).name, reason: r.reason }));
  } catch (err) {
    console.error('Recommendation error:', err.message);
    return items.sort((a, b) => b.popularity - a.popularity).slice(0, 3).map((i) => ({ id: i._id, name: i.name, reason: 'One of our most popular dishes.' }));
  }
};
