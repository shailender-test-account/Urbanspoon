import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getErrorMessage } from '../api/axios';

export const fetchMenu = createAsyncThunk('menu/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/menu');
    return data.items;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

export const fetchRecommendations = createAsyncThunk('menu/recommend', async (preference, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/menu/recommend', { preference });
    return data.recommendations;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: { items: [], loading: false, error: null, recommendations: [], recLoading: false, recError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchMenu.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchRecommendations.pending, (s) => {
        s.recLoading = true;
        s.recError = null;
      })
      .addCase(fetchRecommendations.fulfilled, (s, a) => {
        s.recLoading = false;
        s.recommendations = a.payload;
      })
      .addCase(fetchRecommendations.rejected, (s, a) => {
        s.recLoading = false;
        s.recError = a.payload;
      });
  },
});

export default menuSlice.reducer;
