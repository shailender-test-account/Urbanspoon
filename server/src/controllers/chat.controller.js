import asyncHandler from '../utils/asyncHandler.js';
import { generateReply } from '../services/ai.service.js';

// POST /api/chat  — stateless: client sends recent history, server returns the reply
export const chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;
  const safeHistory = Array.isArray(history)
    ? history
        .filter((m) => m && typeof m.content === 'string' && ['user', 'assistant'].includes(m.role))
        .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }))
    : [];
  const { reply, source } = await generateReply(safeHistory, message);
  res.json({ success: true, reply, source });
});
