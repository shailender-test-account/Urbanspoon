import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const markAllRead = createAsyncThunk('notifications/readAll', async () => {
  await api.patch('/notifications/read-all');
});

export const markRead = createAsyncThunk('notifications/read', async (id) => {
  await api.patch(`/notifications/${id}/read`);
  return id;
});

const slice = createSlice({
  name: 'notifications',
  initialState: { items: [], unread: 0 },
  reducers: {
    clearNotifications: (s) => {
      s.items = [];
      s.unread = 0;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchNotifications.fulfilled, (s, a) => {
      s.items = a.payload.notifications;
      s.unread = a.payload.unread;
    })
      .addCase(markAllRead.fulfilled, (s) => {
        s.items = s.items.map((n) => ({ ...n, read: true }));
        s.unread = 0;
      })
      .addCase(markRead.fulfilled, (s, a) => {
        const n = s.items.find((x) => x._id === a.payload);
        if (n && !n.read) {
          n.read = true;
          s.unread = Math.max(0, s.unread - 1);
        }
      });
  },
});

export const { clearNotifications } = slice.actions;
export default slice.reducer;
