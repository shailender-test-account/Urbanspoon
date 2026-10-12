import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getErrorMessage } from '../api/axios';

export const createBooking = createAsyncThunk('bookings/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/bookings', payload);
    return data.booking;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/my', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bookings/my');
    return data.bookings;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/bookings/${id}/cancel`);
    return data.booking;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

// ---------- admin ----------
export const fetchAllBookings = createAsyncThunk('bookings/all', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bookings', { params });
    return data;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

export const fetchStats = createAsyncThunk('bookings/stats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bookings/stats');
    return data.stats;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

export const updateBookingStatus = createAsyncThunk('bookings/status', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/bookings/${id}/status`, { status });
    return data.booking;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

export const deleteBooking = createAsyncThunk('bookings/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/bookings/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    mine: [],
    all: [],
    total: 0,
    pages: 1,
    stats: null,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (s) => {
        s.submitting = true;
        s.error = null;
      })
      .addCase(createBooking.fulfilled, (s, a) => {
        s.submitting = false;
        s.mine.unshift(a.payload);
      })
      .addCase(createBooking.rejected, (s, a) => {
        s.submitting = false;
        s.error = a.payload;
      })
      .addCase(fetchMyBookings.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (s, a) => {
        s.loading = false;
        s.mine = a.payload;
      })
      .addCase(fetchMyBookings.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(cancelBooking.fulfilled, (s, a) => {
        s.mine = s.mine.map((b) => (b._id === a.payload._id ? a.payload : b));
      })
      .addCase(fetchAllBookings.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchAllBookings.fulfilled, (s, a) => {
        s.loading = false;
        s.all = a.payload.bookings;
        s.total = a.payload.total;
        s.pages = a.payload.pages;
      })
      .addCase(fetchAllBookings.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchStats.fulfilled, (s, a) => {
        s.stats = a.payload;
      })
      .addCase(updateBookingStatus.fulfilled, (s, a) => {
        s.all = s.all.map((b) => (b._id === a.payload._id ? { ...b, status: a.payload.status } : b));
      })
      .addCase(deleteBooking.fulfilled, (s, a) => {
        s.all = s.all.filter((b) => b._id !== a.payload);
        s.total = Math.max(0, s.total - 1);
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
