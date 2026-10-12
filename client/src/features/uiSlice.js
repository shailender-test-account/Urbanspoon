import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { bookingModalOpen: false },
  reducers: {
    openBookingModal: (s) => {
      s.bookingModalOpen = true;
    },
    closeBookingModal: (s) => {
      s.bookingModalOpen = false;
    },
  },
});

export const { openBookingModal, closeBookingModal } = uiSlice.actions;
export default uiSlice.reducer;
