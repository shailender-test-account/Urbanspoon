import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../features/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate(location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/'), { replace: true });
  }, [user, navigate, location]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-lightGray">
      <form onSubmit={submit} className="bg-white w-full max-w-md rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        <p className="text-gray-500 text-sm">Login to manage your reservations.</p>
        <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field pl-3 !text-sm !py-3" />
        <input type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="field pl-3 !text-sm !py-3" />
        {error && <p className="err text-xs">{error}</p>}
        <button disabled={loading} className="w-full bg-primary hover:bg-primaryHover disabled:opacity-60 text-white py-3 rounded-lg font-bold text-sm transition">{loading ? 'Logging in…' : 'Login'}</button>
        <p className="text-xs text-gray-500 text-center">No account? <Link to="/register" className="text-primary font-semibold">Sign up</Link></p>
      </form>
    </div>
  );
}
