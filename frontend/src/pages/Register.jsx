import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ButtonSpinner from "../components/common/ButtonSpinner";

// Small reusable text field, was used below but never defined
function TextField({ label, type = "text", value, onChange, required, error }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-1 w-full border px-3 py-2 text-sm focus-visible:outline-denim ${
          error ? "border-red-500" : "border-line"
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">
          ❌ {error}
        </p>
      )}
    </label>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const update = (field) => (e) => {
    const value = field === "acceptTerms" ? e.target.checked : e.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    validateField(field, value);

    if (field === "password" && form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === form.confirmPassword ? "" : "Passwords do not match.",
      }));
    }
  };

  const validateField = (field, value) => {
    let message = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          message = "Full name is required.";
        } else if (value.trim().length < 3) {
          message = "Name must be at least 3 characters.";
        }
        break;

      case "email":
        if (!value.trim()) {
          message = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = "Enter a valid email.";
        }
        break;

      case "password":
        if (value.length < 8) {
          message = "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(value)) {
          message = "Add an uppercase letter.";
        } else if (!/[a-z]/.test(value)) {
          message = "Add a lowercase letter.";
        } else if (!/[0-9]/.test(value)) {
          message = "Add a number.";
        } else if (!/[!@#$%^&*]/.test(value)) {
          message = "Add a special character.";
        }
        break;

      case "confirmPassword":
        if (value !== form.password) {
          message = "Passwords do not match.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    return score;
  };

  const strength = getPasswordStrength(form.password);

  // Checks all fields at once (covers fields the user never blurred/typed into)
  const validateAll = () => {
    validateField("name", form.name);
    validateField("email", form.email);
    validateField("password", form.password);
    validateField("confirmPassword", form.confirmPassword);

    const hasContent =
      form.name.trim() &&
      form.email.trim() &&
      form.password &&
      form.confirmPassword === form.password;

    const noErrors =
      !errors.name && !errors.email && !errors.password && !errors.confirmPassword;

    return hasContent && noErrors && form.acceptTerms;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.acceptTerms) {
      setError("You must accept the Terms & Conditions.");
      return;
    }

    if (!validateAll()) {
      setError("Please fix the highlighted fields before continuing.");
      return;
    }

    setBusy(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      setRegistered(true);

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (registered) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎉</div>

        <h1 className="font-display text-3xl tracking-tightest text-denim mb-3">
          Welcome to ShopSphere
        </h1>

        <p className="text-sm text-ink/60">
          We've sent a verification email to
          <br />
          <strong>{form.email}</strong>
        </p>

        <p className="mt-3 text-xs text-ink/50">Redirecting to homepage...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl tracking-tightest mb-1">
        CREATE ACCOUNT
      </h1>

      <p className="text-sm text-ink/50 mb-8">Join ShopSphere in seconds.</p>

      {error && (
        <div className="mb-5 border border-red-500 bg-red-50 text-red-600 text-sm px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        {/* Name */}
        <TextField
          label="Full Name"
          value={form.name}
          onChange={update("name")}
          required
          error={errors.name}
        />

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          required
          error={errors.email}
        />

        {/* Phone */}
        <TextField
          label="Phone (Optional)"
          value={form.phone}
          onChange={update("phone")}
        />

        {/* Password */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Password
          </span>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              required
              className={`w-full border px-3 py-2 pr-12 text-sm focus-visible:outline-denim ${
                errors.password ? "border-red-500" : "border-line"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-transform"
            >
              {showPassword ? "🙈" : "👀"}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">❌ {errors.password}</p>
          )}

          {/* Strength */}
          <div className="mt-3">
            <div className="h-2 rounded bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  strength <= 1
                    ? "bg-red-500 w-1/5"
                    : strength === 2
                    ? "bg-orange-500 w-2/5"
                    : strength === 3
                    ? "bg-yellow-500 w-3/5"
                    : strength === 4
                    ? "bg-blue-500 w-4/5"
                    : "bg-green-500 w-full"
                }`}
              />
            </div>

            <p className="mt-1 text-xs text-gray-500">
              {strength === 0 && "Start typing..."}
              {strength === 1 && "Very Weak"}
              {strength === 2 && "Weak"}
              {strength === 3 && "Medium"}
              {strength === 4 && "Strong"}
              {strength === 5 && "Very Strong"}
            </p>
          </div>

          {/* Checklist */}
          <div className="mt-3 space-y-1 text-xs">
            <p className={form.password.length >= 8 ? "text-green-600" : "text-gray-500"}>
              {form.password.length >= 8 ? "✅" : "⬜"} At least 8 characters
            </p>

            <p className={/[A-Z]/.test(form.password) ? "text-green-600" : "text-gray-500"}>
              {/[A-Z]/.test(form.password) ? "✅" : "⬜"} Uppercase letter
            </p>

            <p className={/[a-z]/.test(form.password) ? "text-green-600" : "text-gray-500"}>
              {/[a-z]/.test(form.password) ? "✅" : "⬜"} Lowercase letter
            </p>

            <p className={/[0-9]/.test(form.password) ? "text-green-600" : "text-gray-500"}>
              {/[0-9]/.test(form.password) ? "✅" : "⬜"} Number
            </p>

            <p
              className={
                /[!@#$%^&*]/.test(form.password) ? "text-green-600" : "text-gray-500"
              }
            >
              {/[!@#$%^&*]/.test(form.password) ? "✅" : "⬜"} Special character
            </p>
          </div>
        </label>

        {/* Confirm Password */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Confirm Password
          </span>

          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              required
              className={`w-full border px-3 py-2 pr-12 text-sm focus-visible:outline-denim ${
                errors.confirmPassword ? "border-red-500" : "border-line"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-transform"
            >
              {showConfirmPassword ? "🙈" : "👀"}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              ❌ {errors.confirmPassword}
            </p>
          )}
        </label>

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={update("acceptTerms")}
            className="mt-1"
          />

          <span>
            I agree to the{" "}
            <Link to="/terms" className="text-denim font-semibold hover:underline">
              Terms & Conditions
            </Link>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-denim text-white py-2.5 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
        >
          {busy ? <ButtonSpinner /> : "Create Account"}
        </button>

        <p className="text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="text-denim font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}