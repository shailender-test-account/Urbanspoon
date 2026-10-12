import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../models/User.js';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem, recommend } from '../controllers/menu.controller.js';

const router = Router();

router.get('/', getMenu);
router.post(
  '/recommend',
  [body('preference').trim().isLength({ min: 2, max: 300 }).withMessage('Preference must be 2-300 characters')],
  validate,
  recommend
);

router.use(protect, authorize(ROLES.ADMIN));
router.post('/', createMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
