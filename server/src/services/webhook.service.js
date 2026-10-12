import crypto from 'crypto';
import dns from 'dns/promises';
import net from 'net';
import WebhookEndpoint from '../models/WebhookEndpoint.js';

const RETRY_DELAYS_MS = [0, 2000, 10000]; // 3 attempts
const TIMEOUT_MS = 8000;
const AUTO_DISABLE_AFTER = 10; 

export const generateSecret = () => `whsec_${crypto.randomBytes(24).toString('hex')}`;

// HMAC-SHA256 over `${timestamp}.${rawBody}` – receivers verify with the same secret.
export const sign = (secret, timestamp, body) =>
  `sha256=${crypto.createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}`;

const isPrivateIp = (ip) => {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }
  const v = ip.toLowerCase();
  return v === '::1' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v.startsWith('::ffff:127.') || v.startsWith('::ffff:10.') || v.startsWith('::ffff:192.168.');
};

// SSRF protection: in production only public https targets are allowed.
export const assertSafeUrl = async (rawUrl) => {
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL');
  }
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('URL must be http(s)');
  if (process.env.NODE_ENV === 'production') {
    if (u.protocol !== 'https:') throw new Error('Webhook URL must use https in production');
    const host = u.hostname.replace(/^\[|\]$/g, '');
    const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
    if (addrs.some((a) => isPrivateIp(a.address))) throw new Error('Webhook URL resolves to a private address');
  }
  return u;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One signed POST with retries. Returns { ok, status, error, attempts }.
export const deliver = async (endpoint, event, data) => {
  const deliveryId = crypto.randomUUID();
  const body = JSON.stringify({ id: deliveryId, event, createdAt: new Date().toISOString(), data });
  let last = { ok: false, status: 0, error: 'not attempted' };

  for (let i = 0; i < RETRY_DELAYS_MS.length; i++) {
    if (RETRY_DELAYS_MS[i]) await sleep(RETRY_DELAYS_MS[i]);
    try {
      await assertSafeUrl(endpoint.url);
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const res = await fetch(endpoint.url, {
        method: 'POST',
        redirect: 'manual', // never follow redirects (SSRF)
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'UrbanSpoon-Webhooks/1.0',
          'X-UrbanSpoon-Event': event,
          'X-UrbanSpoon-Delivery': deliveryId,
          'X-UrbanSpoon-Timestamp': timestamp,
          'X-UrbanSpoon-Signature': sign(endpoint.secret, timestamp, body),
        },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      last = { ok: res.status >= 200 && res.status < 300, status: res.status, error: null, attempts: i + 1 };
      if (last.ok) return last;
      if (res.status >= 400 && res.status < 500 && res.status !== 429) return last; // permanent client error, don't retry
    } catch (err) {
      last = { ok: false, status: 0, error: err.message, attempts: i + 1 };
    }
  }
  return last;
};

// Fan-out an event to every active endpoint subscribed to it. Never throws.
export const dispatchEvent = async (event, data) => {
  try {
    const endpoints = await WebhookEndpoint.find({ active: true, events: event }).select('+secret');
    await Promise.allSettled(
      endpoints.map(async (ep) => {
        const r = await deliver(ep, event, data);
        const update = r.ok
          ? { lastStatus: r.status, lastError: null, lastDeliveredAt: new Date(), failureCount: 0 }
          : { lastStatus: r.status, lastError: r.error || `HTTP ${r.status}`, $inc: { failureCount: 1 } };
        const doc = await WebhookEndpoint.findByIdAndUpdate(ep._id, update, { new: true });
        if (doc && doc.failureCount >= AUTO_DISABLE_AFTER) {
          await WebhookEndpoint.findByIdAndUpdate(ep._id, { active: false });
          console.warn(`Webhook ${ep._id} auto-disabled after ${AUTO_DISABLE_AFTER} failures`);
        }
      })
    );
  } catch (err) {
    console.error('dispatchEvent error:', err.message);
  }
};
