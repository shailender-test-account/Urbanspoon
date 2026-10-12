import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../features/bookingSlice';
import { openBookingModal } from '../features/uiSlice';
import StatusBadge from '../components/StatusBadge';

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function MyBookings() {
  const dispatch = useDispatch();
  const { mine, loading, error } = useSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const cancel = (id) => {
    if (window.confirm('Cancel this reservation?')) dispatch(cancelBooking(id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[60vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold font-serif">My Bookings</h1>
        <button onClick={() => dispatch(openBookingModal())} className="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-full text-xs font-bold">+ New Booking</button>
      </div>
      {loading && <p className="text-center text-primary text-2xl"><i className="fa-solid fa-spinner fa-spin" /></p>}
      {error && <p className="err text-sm">{error}</p>}
      {!loading && mine.length === 0 && <p className="text-center text-gray-500 py-16">You have no bookings yet.</p>}
      <div className="space-y-4">
        {mine.map((b) => (
          <div key={b._id} className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold">{fmt(b.date)} · {b.time}</p>
              <p className="text-xs text-gray-500 mt-1">{b.guests} guests · {b.occasion !== 'none' ? `${b.occasion} · ` : ''}{b.phone}</p>
              {b.specialRequests && <p className="text-xs text-gray-400 mt-1 italic">“{b.specialRequests}”</p>}
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={b.status} />
              {['pending', 'confirmed'].includes(b.status) && (
                <button onClick={() => cancel(b._id)} className="text-xs text-red-500 hover:underline font-semibold">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
