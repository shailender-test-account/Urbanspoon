import mongoose from 'mongoose';

export const WEBHOOK_EVENTS = ['booking.created', 'booking.confirmed', 'booking.cancelled', 'booking.completed'];

const webhookEndpointSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 120 },
    secret: { type: String, required: true, select: false }, // used to sign payloads
    events: { type: [{ type: String, enum: WEBHOOK_EVENTS }], default: ['booking.confirmed'] },
    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // last delivery summary (cheap observability)
    lastStatus: { type: Number },
    lastError: { type: String },
    lastDeliveredAt: { type: Date },
    failureCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('WebhookEndpoint', webhookEndpointSchema);
