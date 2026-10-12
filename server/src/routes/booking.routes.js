import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../models/User.js';
import { BOOKING_STATUS } from '../models/Booking.js';
import {
  createBooking,
  getMyBookings,
  cancelMyBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getStats,
} from '../controllers/booking.controller.js';

const router = Router();

router.use(protect);

// ----- user routes -----
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').matches(/^[0-9\s\-+()]{10,}$/).withMessage('Valid phone number required (min 10 digits)'),
    body('date').isISO8601().withMessage('Valid date required'),
    body('time').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Valid time required (HH:mm)'),
    body('guests').isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
    body('occasion').optional().isIn(['none', 'birthday', 'anniversary', 'business', 'date']),
    body('specialRequests').optional().isLength({ max: 500 }),
  ],
  validate,
  createBooking
);
router.get('/my', getMyBookings);
router.patch('/:id/cancel', cancelMyBooking);

// ----- admin routes -----
router.use(authorize(ROLES.ADMIN));
router.get('/stats', getStats);
router.get('/', getAllBookings);
router.patch(
  '/:id/status',
  [body('status').isIn(BOOKING_STATUS).withMessage(`Status must be one of: ${BOOKING_STATUS.join(', ')}`)],
  validate,
  updateBookingStatus
);
router.delete('/:id', deleteBooking);

export default router;
