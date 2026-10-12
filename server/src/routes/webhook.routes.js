import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../models/User.js';
import { WEBHOOK_EVENTS } from '../models/WebhookEndpoint.js';
import {
  listEndpoints,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  testEndpoint,
} from '../controllers/webhook.controller.js';

const router = Router();
router.use(protect, authorize(ROLES.ADMIN));

const rules = [
  body('events').optional().isArray({ min: 1 }).withMessage('events must be a non-empty array'),
  body('events.*').optional().isIn(WEBHOOK_EVENTS).withMessage(`events must be in: ${WEBHOOK_EVENTS.join(', ')}`),
  body('description').optional().isLength({ max: 120 }),
];

router.get('/', listEndpoints);
router.post('/', [body('url').isURL({ require_tld: false, protocols: ['http', 'https'] }).withMessage('Valid URL required'), ...rules], validate, createEndpoint);
router.patch('/:id', rules, validate, updateEndpoint);
router.delete('/:id', deleteEndpoint);
router.post('/:id/test', testEndpoint);

export default router;
