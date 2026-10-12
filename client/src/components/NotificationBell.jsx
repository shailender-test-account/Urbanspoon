import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllRead, markRead } from '../features/notificationSlice';

const POLL_MS = 30000;

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { items, unread } = useSelector((s) => s.notifications);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Poll for new notifications (pauses while the tab is hidden)
  useEffect(() => {
    dispatch(fetchNotifications());
    const id = setInterval(() => {
      if (!document.hidden) dispatch(fetchNotifications());
    }, POLL_MS);
    return () => clearInterval(id);
  }, [dispatch]);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label="Notifications" className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600">
        <i className="fa-regular fa-bell text-lg" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-gray-100 rounded-xl shadow-2xl z-[60] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h4 className="font-bold text-sm">Notifications</h4>
            {unread > 0 && <button onClick={() => dispatch(markAllRead())} className="text-[11px] text-primary font-semibold">Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 && <p className="text-center text-xs text-gray-400 py-8">No notifications yet</p>}
            {items.map((n) => (
              <button key={n._id} onClick={() => !n.read && dispatch(markRead(n._id))} className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${n.read ? '' : 'bg-orange-50/60'}`}>
                <p className="text-xs font-bold">{n.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
