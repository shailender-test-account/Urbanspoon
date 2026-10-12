import Booking, { BOOKING_STATUS } from '../models/Booking.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { notifyAdminNewBooking } from '../services/whatsapp.service.js';
import { notifyBookingStatus, emitBookingCreated } from '../services/notification.service.js';

// POST /api/bookings  (any logged-in user)
export const createBooking = asyncHandler(async (req, res) => {
  const { name, phone, email, date, time, guests, occasion, specialRequests } = req.body;

  const day = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (day < today) throw new AppError('Booking date cannot be in the past', 400);

  const booking = await Booking.create({
    user: req.user._id,
    name,
    phone,
    email: email || req.user.email,
    date: day,
    time,
    guests,
    occasion,
    specialRequests,
  });

  // Fire-and-forget: never block the response on WhatsApp
  notifyAdminNewBooking(booking).catch(() => {});
  emitBookingCreated(booking);

  res.status(201).json({ success: true, booking });
});

// GET /api/bookings/my
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// PATCH /api/bookings/:id/cancel  (owner only)
export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (['cancelled', 'completed'].includes(booking.status)) throw new AppError(`Booking already ${booking.status}`, 400);
  booking.status = 'cancelled';
  await booking.save();
  res.json({ success: true, booking });
});

// ---------- ADMIN ----------

// GET /api/bookings?status=&date=&search=&page=&limit=
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, date, search } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  const filter = {};
  if (status && BOOKING_STATUS.includes(status)) filter.status = status;
  if (date) {
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.date = { $gte: start, $lt: end };
  }
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { phone: rx }, { email: rx }];
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('user', 'name email')
      .sort({ date: -1, time: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  res.json({ success: true, total, page, pages: Math.ceil(total / limit), bookings });
});

// PATCH /api/bookings/:id/status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  const previous = booking.status;
  booking.status = req.body.status;
  await booking.save();
  // Only notify on a real change (avoids duplicate messages if admin re-selects the same status)
  if (previous !== booking.status) notifyBookingStatus(booking);
  res.json({ success: true, booking });
});

// DELETE /api/bookings/:id
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  res.json({ success: true, message: 'Booking deleted' });
});

// GET /api/bookings/stats
export const getStats = asyncHandler(async (_req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [byStatus, todayCount, total] = await Promise.all([
    Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Booking.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
    Booking.countDocuments(),
  ]);

  const stats = { total, today: todayCount, pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
  byStatus.forEach((s) => (stats[s._id] = s.count));
  res.json({ success: true, stats });
});
