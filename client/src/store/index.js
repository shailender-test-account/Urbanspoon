import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/authSlice';
import bookings from '../features/bookingSlice';
import menu from '../features/menuSlice';
import chat from '../features/chatSlice';
import ui from '../features/uiSlice';
import notifications from '../features/notificationSlice';

export const store = configureStore({
  reducer: { auth, bookings, menu, chat, ui, notifications },
});
