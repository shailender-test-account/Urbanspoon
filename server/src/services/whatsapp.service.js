const GRAPH_URL = 'https://graph.facebook.com/v20.0';

const digits = (v = '') => String(v).replace(/\D/g, '');

export const isWhatsAppConfigured = () =>
  Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

// Sends a plain text message via the WhatsApp Cloud API.
// NOTE: free-form text only delivers inside the 24h customer-service window;
// for first-contact messages create an approved template in Meta Business Manager.
export const sendWhatsAppText = async (to, body) => {
  if (!isWhatsAppConfigured() || !to) return { skipped: true };

  try {
    const res = await fetch(`${GRAPH_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: digits(to),
        type: 'text',
        text: { body },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('WhatsApp API error:', JSON.stringify(data));
      return { error: data };
    }
    return { data, messageId: data.messages?.[0]?.id };
  } catch (err) {
    console.error('WhatsApp send failed:', err.message);
    return { error: err.message };
  }
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

export const notifyAdminNewBooking = (booking) =>
  sendWhatsAppText(
    process.env.WHATSAPP_ADMIN_NUMBER,
    `🍽️ New table booking\nName: ${booking.name}\nPhone: ${booking.phone}\nDate: ${formatDate(booking.date)} at ${booking.time}\nGuests: ${booking.guests}\nOccasion: ${booking.occasion}`
  );

export const notifyCustomerStatus = (booking) =>
  sendWhatsAppText(
    booking.phone,
    `Hi ${booking.name}, your Urban Spoon reservation for ${formatDate(booking.date)} at ${booking.time} (${booking.guests} guests) is now *${booking.status}*.`
  );
