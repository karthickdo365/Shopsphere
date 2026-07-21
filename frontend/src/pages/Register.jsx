import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      setRegistered(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  if (registered) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl tracking-tightest mb-3 text-denim">WELCOME TO SHOPSPHERE</h1>
        <p className="text-sm text-ink/60">
          We've sent a verification link to <strong>{form.email}</strong>. You're logged in already — verify
          whenever you get a chance.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-3xl tracking-tightest mb-1">CREATE ACCOUNT</h1>
      <p className="text-sm text-ink/50 mb-6">Join ShopSphere in seconds.</p>
      <form onSubmit={submit} className="space-y-4">
        <TextField label="Full Name" value={form.name} onChange={update('name')} required />
        <TextField label="Email" type="email" value={form.email} onChange={update('email')} required />
        <TextField label="Phone" value={form.phone} onChange={update('phone')} />
        <TextField label="Password" type="password" value={form.password} onChange={update('password')} required minLength={6} />
        {error && <p className="text-sm text-rust">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink text-paper font-semibold uppercase tracking-wide py-3 hover:bg-denim disabled:opacity-50"
        >
          {busy ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      <p className="text-sm text-ink/60 mt-4">
        Already have an account? <Link to="/login" className="text-denim font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">{label}</span>
      <input {...props} className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm focus-visible:outline-denim" />
    </label>
  );
}
