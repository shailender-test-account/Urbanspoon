import crypto from 'crypto';
import WebhookEndpoint, { WEBHOOK_EVENTS } from '../models/WebhookEndpoint.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { assertSafeUrl, deliver, generateSecret } from '../services/webhook.service.js';

// ---------------- ADMIN: manage outbound webhook endpoints ----------------

// GET /api/webhooks
export const listEndpoints = asyncHandler(async (_req, res) => {
  const endpoints = await WebhookEndpoint.find().sort({ createdAt: -1 });
  res.json({ success: true, events: WEBHOOK_EVENTS, endpoints });
});

// POST /api/webhooks   → secret is returned ONCE, store it on the receiver
export const createEndpoint = asyncHandler(async (req, res) => {
  const { url, description, events } = req.body;
  try {
    await assertSafeUrl(url);
  } catch (e) {
    throw new AppError(e.message, 400);
  }
  const secret = generateSecret();
  const endpoint = await WebhookEndpoint.create({ url, description, events, secret, createdBy: req.user._id });
  res.status(201).json({ success: true, endpoint: { ...endpoint.toObject(), secret } });
});

// PATCH /api/webhooks/:id
export const updateEndpoint = asyncHandler(async (req, res) => {
  const { url, description, events, active } = req.body;
  if (url) {
    try {
      await assertSafeUrl(url);
    } catch (e) {
      throw new AppError(e.message, 400);
    }
  }
  const update = Object.fromEntries(Object.entries({ url, description, events, active }).filter(([, v]) => v !== undefined));
  if (active === true) update.failureCount = 0;
  const endpoint = await WebhookEndpoint.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!endpoint) throw new AppError('Webhook not found', 404);
  res.json({ success: true, endpoint });
});

// DELETE /api/webhooks/:id
export const deleteEndpoint = asyncHandler(async (req, res) => {
  const endpoint = await WebhookEndpoint.findByIdAndDelete(req.params.id);
  if (!endpoint) throw new AppError('Webhook not found', 404);
  res.json({ success: true, message: 'Webhook deleted' });
});

// POST /api/webhooks/:id/test  → sends a sample event
export const testEndpoint = asyncHandler(async (req, res) => {
  const endpoint = await WebhookEndpoint.findById(req.params.id).select('+secret');
  if (!endpoint) throw new AppError('Webhook not found', 404);
  const result = await deliver(endpoint, 'webhook.test', { message: 'Hello from Urban Spoon 👋' });
  res.json({ success: true, result });
});

// ---------------- PUBLIC: inbound WhatsApp (Meta) webhook ----------------

// GET /api/whatsapp/webhook  → Meta calls this once when you save the webhook in the dashboard
export const verifyWhatsApp = (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && process.env.WHATSAPP_VERIFY_TOKEN && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
};

const verifyMetaSignature = (req) => {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production'; // require a secret in production
  const header = req.get('x-hub-signature-256') || '';
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(req.rawBody || '').digest('hex')}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const RANK = { skipped: 0, sent: 1, delivered: 2, read: 3, failed: 4 };

// POST /api/whatsapp/webhook  → delivery receipts (sent/delivered/read/failed)
export const receiveWhatsApp = asyncHandler(async (req, res) => {
  if (!verifyMetaSignature(req)) return res.sendStatus(401);
  res.sendStatus(200); // ack fast; Meta retries on slow/non-200 responses

  const statuses = (req.body.entry || []).flatMap((e) => (e.changes || []).flatMap((c) => c.value?.statuses || []));
  for (const s of statuses) {
    if (!(s.status in RANK)) continue;
    const note = await Notification.findOne({ waMessageId: s.id });
    // never move backwards (webhooks can arrive out of order)
    if (note && (s.status === 'failed' || RANK[s.status] > RANK[note.waStatus])) {
      note.waStatus = s.status;
      await note.save();
    }
  }
});
