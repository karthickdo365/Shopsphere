import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ButtonSpinner from "../components/common/ButtonSpinner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (emailError) return;

    setError('');
    setBusy(true);

    try {
      const user = await login(form.email, form.password);

      navigate(
        location.state?.from?.pathname ||
          (user.role === 'ADMIN' ? '/admin' : '/')
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Check your credentials.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-3xl tracking-tightest mb-1">
        LOG IN
      </h1>

      <p className="text-sm text-ink/50 mb-6">
        Welcome back to ShopSphere.
      </p>

      <form onSubmit={submit} className="space-y-4">

        {/* Email */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Email
          </span>

          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => {
              const value = e.target.value;

              setForm({
                ...form,
                email: value,
              });

              validateEmail(value);
            }}
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm focus-visible:outline-denim"
          />

          {emailError && (
            <p className="mt-1 text-xs text-red-500">
              {emailError}
            </p>
          )}
        </label>

        {/* Password */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Password
          </span>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full border border-line bg-white px-3 py-2 pr-12 text-sm focus-visible:outline-denim"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-transform"
            >
              {showPassword ? "🙈" : "👀"}
            </button>
          </div>
        </label>

        <div className="text-right -mt-2">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-denim hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="text-sm text-rust">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || emailError}
          className="w-full bg-ink text-paper font-semibold uppercase tracking-wide py-3 hover:bg-denim disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? (
            <ButtonSpinner text="Logging in..." />
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-4">
        New here?{" "}
        <Link
          to="/register"
          className="text-denim font-semibold hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}