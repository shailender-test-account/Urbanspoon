import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, fetchStats, updateBookingStatus, deleteBooking } from '../../features/bookingSlice';
import StatusBadge from '../../components/StatusBadge';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function Dashboard() {
  const dispatch = useDispatch();
  const { all, total, pages, stats, loading, error } = useSelector((s) => s.bookings);
  const [filters, setFilters] = useState({ status: '', date: '', search: '', page: 1 });
  const [debounced, setDebounced] = useState(filters);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(filters), 350);
    return () => clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(debounced).filter(([, v]) => v !== ''));
    dispatch(fetchAllBookings(params));
  }, [dispatch, debounced]);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch, all.length]);

  const setF = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value, page: 1 }));

  const changeStatus = async (id, status) => {
    await dispatch(updateBookingStatus({ id, status }));
    dispatch(fetchStats());
  };

  const remove = (id) => {
    if (window.confirm('Permanently delete this booking?')) dispatch(deleteBooking(id));
  };

  const cards = [
    ['Total', stats?.total, 'fa-list', 'text-dark'],
    ['Today', stats?.today, 'fa-calendar-day', 'text-primary'],
    ['Pending', stats?.pending, 'fa-hourglass-half', 'text-yellow-600'],
    ['Confirmed', stats?.confirmed, 'fa-circle-check', 'text-green-600'],
    ['Cancelled', stats?.cancelled, 'fa-ban', 'text-red-600'],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <h1 className="text-3xl font-extrabold font-serif mb-6">Admin · Table Bookings</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map(([label, val, icon, color]) => (
          <div key={label} className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <i className={`fa-solid ${icon} text-xl ${color}`} />
            <div><p className="text-2xl font-extrabold leading-none">{val ?? '–'}</p><p className="text-[11px] text-gray-500 mt-1">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input placeholder="Search name / phone / email" value={filters.search} onChange={setF('search')} className="field pl-3" />
        <select value={filters.status} onChange={setF('status')} className="field pl-3">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <input type="date" value={filters.date} onChange={setF('date')} className="field pl-3" />
      </div>

      {error && <p className="err text-sm mb-2">{error}</p>}

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-lightGray text-left text-[11px] uppercase tracking-wider text-gray-500">
            <tr>
              {['Guest', 'Contact', 'Date & Time', 'Guests', 'Occasion', 'Status', 'Actions'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan="7" className="text-center py-10 text-primary"><i className="fa-solid fa-spinner fa-spin" /></td></tr>}
            {!loading && all.length === 0 && <tr><td colSpan="7" className="text-center py-10 text-gray-500">No bookings found.</td></tr>}
            {!loading && all.map((b) => (
              <tr key={b._id} className="hover:bg-orange-50/30">
                <td className="px-4 py-3"><p className="font-semibold">{b.name}</p><p className="text-[11px] text-gray-400">{b.user?.email}</p></td>
                <td className="px-4 py-3 text-xs"><p>{b.phone}</p>
                  <a className="text-whatsapp font-semibold" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}><i className="fa-brands fa-whatsapp" /> Chat</a>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{fmt(b.date)} · {b.time}</td>
                <td className="px-4 py-3">{b.guests}</td>
                <td className="px-4 py-3 capitalize text-xs">{b.occasion}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select value={b.status} onChange={(e) => changeStatus(b._id, e.target.value)} className="border border-gray-200 rounded-lg text-xs px-2 py-1 capitalize">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => remove(b._id)} aria-label="Delete" className="text-red-500 hover:text-red-700"><i className="fa-solid fa-trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <span>{total} bookings</span>
        <div className="flex items-center gap-2">
          <button disabled={filters.page <= 1} onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))} className="px-3 py-1.5 border rounded-lg disabled:opacity-40">Prev</button>
          <span>Page {filters.page} / {pages}</span>
          <button disabled={filters.page >= pages} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))} className="px-3 py-1.5 border rounded-lg disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
