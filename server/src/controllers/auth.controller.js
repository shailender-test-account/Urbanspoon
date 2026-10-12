import User, { ROLES } from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken, cookieOptions } from '../services/token.service.js';

const sendAuth = (res, user, statusCode = 200) => {
  const token = signToken(user._id);
  res.cookie('token', token, cookieOptions());
  res.status(statusCode).json({
    success: true,
    token, // also returned so the SPA can use Bearer auth if cookies are blocked
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
};

// POST /api/auth/register  (public registrations are always role=user)
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already registered', 409);
  const user = await User.create({ name, email, phone, password, role: ROLES.USER });
  sendAuth(res, user, 201);
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) throw new AppError('Invalid email or password', 401);
  sendAuth(res, user);
});

// POST /api/auth/logout
export const logout = (_req, res) => {
  res.clearCookie('token', { ...cookieOptions(), maxAge: undefined });
  res.json({ success: true, message: 'Logged out' });
};

// GET /api/auth/me
export const me = (req, res) => {
  const u = req.user;
  res.json({ success: true, user: { id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role } });
};
