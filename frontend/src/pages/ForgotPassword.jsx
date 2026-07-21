import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await forgotPassword(email);
      setSent(true); // backend always returns a generic success message, whether or not the email exists
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl tracking-tightest mb-3">CHECK YOUR EMAIL</h1>
        <p className="text-sm text-ink/60">
          If an account exists for <strong>{email}</strong>, we've sent a password reset link. It expires in 1 hour.
        </p>
        <Link to="/login" className="inline-block mt-6 text-sm font-semibold text-denim hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-3xl tracking-tightest mb-1">FORGOT PASSWORD</h1>
      <p className="text-sm text-ink/50 mb-6">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm focus-visible:outline-denim"
          />
        </label>
        {error && <p className="text-sm text-rust">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink text-paper font-semibold uppercase tracking-wide py-3 hover:bg-denim disabled:opacity-50"
        >
          {busy ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>
      <p className="text-sm text-ink/60 mt-4">
        <Link to="/login" className="text-denim font-semibold hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
