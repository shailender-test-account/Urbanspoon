import mongoose from 'mongoose';

export const BOOKING_STATUS = ['pending', 'confirmed', 'cancelled', 'completed'];

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    guests: { type: Number, required: true, min: 1, max: 20 },
    occasion: {
      type: String,
      enum: ['none', 'birthday', 'anniversary', 'business', 'date'],
      default: 'none',
    },
    specialRequests: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: BOOKING_STATUS, default: 'pending', index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
