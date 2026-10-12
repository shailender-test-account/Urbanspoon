import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../features/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [localErr, setLocalErr] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (form.password.length < 8) return setLocalErr('Password must be at least 8 characters');
    setLocalErr('');
    dispatch(registerUser(form));
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-lightGray">
      <form onSubmit={submit} className="bg-white w-full max-w-md rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
        <h1 className="text-2xl font-extrabold">Create account</h1>
        <p className="text-gray-500 text-sm">Join Urban Spoon to book tables and get offers.</p>
        <input required placeholder="Full name" value={form.name} onChange={set('name')} className="field pl-3 !text-sm !py-3" />
        <input type="email" required placeholder="Email" value={form.email} onChange={set('email')} className="field pl-3 !text-sm !py-3" />
        <input type="tel" placeholder="Phone (with country code)" value={form.phone} onChange={set('phone')} className="field pl-3 !text-sm !py-3" />
        <input type="password" required placeholder="Password (min 8 chars)" value={form.password} onChange={set('password')} className="field pl-3 !text-sm !py-3" />
        {(localErr || error) && <p className="err text-xs">{localErr || error}</p>}
        <button disabled={loading} className="w-full bg-primary hover:bg-primaryHover disabled:opacity-60 text-white py-3 rounded-lg font-bold text-sm transition">{loading ? 'Creating…' : 'Sign up'}</button>
        <p className="text-xs text-gray-500 text-center">Already registered? <Link to="/login" className="text-primary font-semibold">Login</Link></p>
      </form>
    </div>
  );
}
