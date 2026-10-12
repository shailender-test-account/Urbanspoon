import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { register, login, logout, me } from '../controllers/auth.controller.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').optional({ checkFalsy: true }).matches(/^[0-9\s\-+()]{10,}$/).withMessage('Invalid phone number'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail(), body('password').notEmpty().withMessage('Password is required')],
  validate,
  login
);

router.post('/logout', logout);
router.get('/me', protect, me);

export default router;
