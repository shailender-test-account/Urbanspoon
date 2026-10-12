import MenuItem from '../models/MenuItem.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { recommendDishes } from '../services/ai.service.js';

// GET /api/menu  (public)
export const getMenu = asyncHandler(async (_req, res) => {
  const items = await MenuItem.find({ available: true }).sort({ popularity: -1 });
  res.json({ success: true, count: items.length, items });
});

// POST /api/menu  (admin)
export const createMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json({ success: true, item });
});

// PUT /api/menu/:id  (admin)
export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) throw new AppError('Menu item not found', 404);
  res.json({ success: true, item });
});

// DELETE /api/menu/:id  (admin)
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Menu item not found', 404);
  res.json({ success: true, message: 'Menu item deleted' });
});

// POST /api/menu/recommend  (public, AI)
export const recommend = asyncHandler(async (req, res) => {
  const recommendations = await recommendDishes(req.body.preference);
  res.json({ success: true, recommendations });
});
