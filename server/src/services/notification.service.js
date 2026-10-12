import Notification from '../models/Notification.js';
import { sendWhatsAppText } from './whatsapp.service.js';
import { dispatchEvent } from './webhook.service.js';

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

const COPY = {
  confirmed: (b) => ({
    title: 'Booking confirmed ✅',
    message: `Hi ${b.name}, your table for ${b.guests} on ${fmtDate(b.date)} at ${b.time} is confirmed. See you at Urban Spoon!`,
  }),
  cancelled: (b) => ({
    title: 'Booking cancelled',
    message: `Hi ${b.name}, your reservation on ${fmtDate(b.date)} at ${b.time} was cancelled. Contact us if this is a mistake.`,
  }),
  completed: (b) => ({
    title: 'Thanks for dining with us',
    message: `Hi ${b.name}, thank you for visiting Urban Spoon on ${fmtDate(b.date)}. We hope to see you again!`,
  }),
};

const payload = (booking) => ({
  bookingId: String(booking._id),
  userId: String(booking.user?._id || booking.user),
  name: booking.name,
  phone: booking.phone,
  email: booking.email,
  date: booking.date,
  time: booking.time,
  guests: booking.guests,
  status: booking.status,
});

// Called after an admin changes a booking's status. Fire-and-forget; never throws.
export const notifyBookingStatus = async (booking) => {
  try {
    const build = COPY[booking.status];
    if (build) {
      const { title, message } = build(booking);

      // 1. In-app notification
      const note = await Notification.create({
        user: booking.user?._id || booking.user,
        booking: booking._id,
        type: `booking.${booking.status}`,
        title,
        message,
      });

      // 2. WhatsApp message (+ remember the id so the inbound webhook can update delivery status)
      const wa = await sendWhatsAppText(booking.phone, `${title}\n${message}`);
      if (wa.messageId) {
        note.waMessageId = wa.messageId;
        note.waStatus = 'sent';
        await note.save();
      } else if (wa.error) {
        note.waStatus = 'failed';
        await note.save();
      }
    }

    // 3. Signed outbound webhooks (CRM, Zapier/Make, your own services…)
    await dispatchEvent(`booking.${booking.status}`, payload(booking));
  } catch (err) {
    console.error('notifyBookingStatus failed:', err.message);
  }
};

export const emitBookingCreated = (booking) => dispatchEvent('booking.created', payload(booking));
