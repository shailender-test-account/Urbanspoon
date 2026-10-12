import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import validate from '../middleware/validate.js';
import { chat } from '../controllers/chat.controller.js';

const router = Router();

// Protect AI spend: 20 messages / minute / IP
const chatLimiter = rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

router.post(
  '/',
  chatLimiter,
  [body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters')],
  validate,
  chat
);

export default router;
