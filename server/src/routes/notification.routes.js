import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getMyNotifications, markRead, markAllRead } from '../controllers/notification.controller.js';

const router = Router();
router.use(protect);
router.get('/', getMyNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

export default router;
