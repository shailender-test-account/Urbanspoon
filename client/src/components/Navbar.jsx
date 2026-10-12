import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/authSlice';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `transition hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-gray-600'}`;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setOpen(false);
    navigate('/');
  };

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
      <NavLink to="/menu" className={linkClass} onClick={() => setOpen(false)}>Menu</NavLink>
      <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact Us</NavLink>
      {user && <NavLink to="/my-bookings" className={linkClass} onClick={() => setOpen(false)}>My Bookings</NavLink>}
      {user?.role === 'admin' && <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>Admin</NavLink>}
    </>
  );

  return (
    <>
      <div className="bg-dark text-white text-[11px] md:text-xs py-2.5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2"><i className="fa-solid fa-truck-fast text-primary" /><span>Free Delivery on orders over $25</span></div>
        <div className="hidden md:flex items-center gap-2"><span>Good Food. Delivered Fast</span><i className="fa-solid fa-bolt text-primary" /></div>
        <div className="flex items-center gap-2"><i className="fa-solid fa-headset text-primary" /><span>24/7 Support</span></div>
      </div>

      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-primary text-3xl"><i className="fa-solid fa-utensils" /></div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl leading-tight text-dark">Urban Spoon</span>
                <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-semibold">Restaurant</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8 font-medium text-sm">{links}</div>

            <div className="hidden md:flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <NotificationBell />
                  <span className="text-gray-500 text-xs">Hi, {user.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="border border-gray-200 hover:border-primary hover:text-primary px-4 py-2 rounded-full text-xs font-semibold transition">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-primary text-xs font-semibold">Login</Link>
                  <Link to="/register" className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-full text-xs font-semibold transition">Sign up</Link>
                </>
              )}
            </div>

            <button className="md:hidden text-dark text-2xl" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
              <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
            <div className="px-4 py-4 flex flex-col gap-4 font-medium text-sm">
              {links}
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                {user ? (
                  <button onClick={handleLogout} className="text-primary font-semibold">Logout</button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="text-gray-600 font-semibold">Login</Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="text-primary font-semibold">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
