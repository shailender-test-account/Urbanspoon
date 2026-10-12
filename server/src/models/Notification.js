import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    type: { type: String, required: true }, // e.g. booking.confirmed
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    // WhatsApp delivery tracking (updated by the inbound webhook)
    waMessageId: { type: String, index: true, sparse: true },
    waStatus: { type: String, enum: ['skipped', 'sent', 'delivered', 'read', 'failed'], default: 'skipped' },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
