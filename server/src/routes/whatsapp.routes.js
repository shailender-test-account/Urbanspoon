import { Router } from 'express';
import { verifyWhatsApp, receiveWhatsApp } from '../controllers/webhook.controller.js';

// Public: called by Meta, secured by verify token + X-Hub-Signature-256
const router = Router();
router.get('/webhook', verifyWhatsApp);
router.post('/webhook', receiveWhatsApp);

export default router;
