import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { closeBookingModal } from '../features/uiSlice';
import { createBooking, clearBookingError } from '../features/bookingSlice';

const initial = { name: '', phone: '', date: '', time: '', guests: 2, occasion: 'none', specialRequests: '' };

const validate = (f) => {
  const e = {};
  if (!f.name.trim()) e.name = 'Please enter your full name';
  if (!/^[0-9\s\-+()]{10,}$/.test(f.phone.trim())) e.phone = 'Enter a valid mobile number (min 10 digits)';
  if (!f.date) e.date = 'Please select a date';
  else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(f.date) < today) e.date = 'Date cannot be in the past';
  }
  if (!f.time) e.time = 'Please select a time';
  return e;
};

function Field({ icon, label, error, children }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <i className={`fa-solid ${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none`} />
        {children}
      </div>
      {error && <p className="err">{error}</p>}
    </div>
  );
}

export default function BookingModal() {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.ui.bookingModalOpen);
  const { user } = useSelector((s) => s.auth);
  const { submitting, error } = useSelector((s) => s.bookings);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (open && user) setForm((f) => ({ ...f, name: f.name || user.name, phone: f.phone || user.phone || '' }));
    if (open) dispatch(clearBookingError());
  }, [open, user, dispatch]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line
  }, [open]);

  const close = () => {
    dispatch(closeBookingModal());
    setTimeout(() => {
      setForm(initial);
      setErrors({});
      setSuccess(false);
    }, 300);
  };

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    const res = await dispatch(createBooking({ ...form, guests: Number(form.guests) }));
    if (createBooking.fulfilled.match(res)) setSuccess(true);
  };

  if (!open) return null;
  const cls = (k) => `field ${errors[k] ? 'field-error' : ''}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl animate-modal-in relative flex flex-col md:flex-row max-h-[95vh] overflow-y-auto">
        <button onClick={close} aria-label="Close" className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition shadow-md">
          <i className="fa-solid fa-xmark text-sm" />
        </button>

        <div className="relative w-full md:w-4/12 h-32 md:h-auto overflow-hidden shrink-0">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop" alt="Restaurant table" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
          <div className="absolute bottom-0 left-0 p-4 md:p-5 text-white z-10">
            <div className="text-primary text-xl mb-1"><i className="fa-solid fa-utensils" /></div>
            <h3 className="text-lg font-extrabold leading-tight mb-1">Reserve Your Table</h3>
            <p className="text-gray-300 text-[10px] font-light">Enjoy a luxurious dining experience at Urban Spoon.</p>
          </div>
        </div>

        <div className="w-full md:w-8/12 p-5 md:p-6 relative">
          {!user ? (
            <div className="py-10 text-center">
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-primary text-2xl mx-auto mb-4"><i className="fa-solid fa-lock" /></div>
              <h2 className="text-xl font-extrabold mb-2">Login to book a table</h2>
              <p className="text-gray-500 text-xs mb-5">Create a free account to manage your reservations.</p>
              <div className="flex justify-center gap-3">
                <Link onClick={close} to="/login" className="bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-full text-xs font-bold">Login</Link>
                <Link onClick={close} to="/register" className="border border-gray-200 hover:border-primary px-6 py-2.5 rounded-full text-xs font-bold">Sign up</Link>
              </div>
            </div>
          ) : success ? (
            <div className="py-10 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-2xl mx-auto mb-4 animate-bounce"><i className="fa-solid fa-check" /></div>
              <h3 className="text-lg font-extrabold mb-1">Table Request Sent!</h3>
              <p className="text-gray-500 text-[11px] max-w-xs mx-auto mb-4">We will confirm your reservation shortly. Track it in “My Bookings”.</p>
              <div className="flex justify-center gap-3">
                <Link onClick={close} to="/my-bookings" className="border border-gray-200 hover:border-primary px-5 py-2 rounded-full text-xs font-bold">My Bookings</Link>
                <button onClick={close} className="bg-primary hover:bg-primaryHover text-white px-6 py-2 rounded-full font-bold text-xs">Great, Thanks!</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-extrabold mb-1">Book a Table</h2>
              <p className="text-gray-500 text-[10px] mb-4">Please fill in your details below.</p>
              <form onSubmit={onSubmit} noValidate className={`space-y-3 ${shake ? 'animate-shake' : ''}`}>
                <Field icon="fa-user" label="Full Name" error={errors.name}>
                  <input className={cls('name')} value={form.name} onChange={set('name')} placeholder="John Doe" />
                </Field>
                <Field icon="fa-phone" label="Mobile Number" error={errors.phone}>
                  <input className={cls('phone')} type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field icon="fa-calendar-days" label="Date" error={errors.date}>
                    <input className={cls('date')} type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={set('date')} />
                  </Field>
                  <Field icon="fa-clock" label="Time" error={errors.time}>
                    <input className={cls('time')} type="time" value={form.time} onChange={set('time')} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field icon="fa-users" label="Guests">
                    <select className="field appearance-none" value={form.guests} onChange={set('guests')}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                    </select>
                  </Field>
                  <Field icon="fa-cake-candles" label="Occasion">
                    <select className="field appearance-none" value={form.occasion} onChange={set('occasion')}>
                      <option value="none">None</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="business">Business Meal</option>
                      <option value="date">Date Night</option>
                    </select>
                  </Field>
                </div>
                <Field icon="fa-message" label="Special requests (optional)">
                  <input className="field" value={form.specialRequests} onChange={set('specialRequests')} maxLength={500} placeholder="Window seat, allergies…" />
                </Field>
                {error && <p className="err text-xs">{error}</p>}
                <button disabled={submitting} className="w-full bg-primary hover:bg-primaryHover disabled:opacity-60 text-white py-2.5 rounded-lg font-bold text-xs shadow-lg shadow-orange-200 transition flex items-center justify-center gap-2 mt-2">
                  {submitting ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-calendar-check" />}
                  {submitting ? 'Booking…' : 'Confirm Reservation'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
