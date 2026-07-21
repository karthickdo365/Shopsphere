import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/auth';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'This reset link is invalid or has expired.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl tracking-tightest mb-3">PASSWORD RESET</h1>
        <p className="text-sm text-ink/60">Redirecting you to login…</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-3xl tracking-tightest mb-1">RESET PASSWORD</h1>
      <p className="text-sm text-ink/50 mb-6">Choose a new password for your account.</p>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">New Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm focus-visible:outline-denim"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">Confirm Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm focus-visible:outline-denim"
          />
        </label>
        {error && <p className="text-sm text-rust">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink text-paper font-semibold uppercase tracking-wide py-3 hover:bg-denim disabled:opacity-50"
        >
          {busy ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
      <p className="text-sm text-ink/60 mt-4">
        <Link to="/login" className="text-denim font-semibold hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
