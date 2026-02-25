import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { setUser } from "../ReduxSlices/userSlice"; 

const BASE_URL = "/auth";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumbers: [{ number: "", label: "Primary" }],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(null);

  // Normalize values
  const email = form.email.trim().toLowerCase();
  const password = form.password.trim();

  // 🔎 Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    setMessage({
      type: "error",
      text: "Please enter a valid email address.",
    });
    return;
  }

  // 🔐 Password validation
  if (password.length < 6) {
    setMessage({
      type: "error",
      text: "Password must be at least 6 characters.",
    });
    return;
  }

  // 📱 Phone validation (signup only)
  if (mode === "signup") {
    const phoneRegex = /^\d{10}$/;

    const invalidPhone = (form.phoneNumbers || []).some((p) => {
      const number = (p?.number ?? "").trim();
      return number && !phoneRegex.test(number);
    });

    if (invalidPhone) {
      setMessage({
        type: "error",
        text: "One or more phone numbers are invalid.",
      });
      return;
    }
  }

  setLoading(true);

  try {
    const endpoint = mode === "login" ? "/login" : "/register";

    const payload =
      mode === "login"
        ? { email, password }
        : {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email,
            password,
            phoneNumbers: (form.phoneNumbers || [])
              .filter((p) => (p?.number ?? "").trim() !== "")
              .map((p) => ({
                number: (p.number ?? "").trim(),
                label: ((p.label ?? "Primary").trim() || "Primary"),
              })),
          };

    const res = await axiosInstance.post(
      `${BASE_URL}${endpoint}`,
      payload
    );

    if (mode === "login") {
      dispatch(setUser(res.data.user ?? res.data));
      navigate("/profile");
    } else {
      setMessage({
        type: "success",
        text: res.data.message || "Account created successfully!",
      });
      dispatch(setUser(res.data.user ?? res.data));
      navigate("/profile");
    }

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumbers: [{ number: "", label: "Primary" }],
    });

  } catch (err) {
    setMessage({
      type: "error",
      text:
        err.response?.data?.message ||
        "Something went wrong. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};
  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumbers: [{ number: "", label: "Primary" }],
    });
    setMessage(null);
    setShowPassword(false);
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none transition-all duration-200 border border-purple-400/20 bg-white/5 focus:border-purple-500/70 focus:bg-white/[0.09] focus:ring-2 focus:ring-purple-500/20";

  const inputPlain =
    "w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none transition-all duration-200 border border-purple-400/20 bg-white/5 focus:border-purple-500/70 focus:bg-white/[0.09] focus:ring-2 focus:ring-purple-500/20";

  const addPhone = () => {
    setForm((f) => ({
      ...f,
      phoneNumbers: [...(f.phoneNumbers || []), { number: "", label: "Mobile" }],
    }));
  };

  const removePhone = (index) => {
    setForm((f) => ({
      ...f,
      phoneNumbers: (f.phoneNumbers || []).filter((_, i) => i !== index),
    }));
  };

  const updatePhone = (index, field, value) => {
    setForm((f) => ({
      ...f,
      phoneNumbers: (f.phoneNumbers || []).map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#150030]">
      {/* Background orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-fuchsia-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-2/3 w-64 h-64 rounded-full bg-violet-600/15 blur-[80px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(147,51,234,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 my-8 rounded-3xl overflow-hidden border border-purple-400/20 transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* Top shimmer */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #c084fc, transparent)",
          }}
        />

        {/* Header */}
        <div className="pt-10 pb-6 px-8 sm:px-10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_8px_32px_rgba(147,51,234,0.5)]">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="absolute inset-[-3px] rounded-full border border-purple-400/30" />
          </div>

          <h1
            className="text-[1.75rem] font-bold text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-1.5 text-sm text-purple-300/70 font-light tracking-wide">
            {mode === "login"
              ? "Sign in to continue your journey"
              : "Join us and get started today"}
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-8 sm:mx-10 mb-6 flex gap-1 p-1 rounded-2xl bg-black/25 border border-purple-500/10">
          {[
            { key: "login", label: "Sign In" },
            { key: "signup", label: "Sign Up" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${
                mode === key
                  ? "bg-gradient-to-r from-violet-700 to-purple-600 text-white shadow-[0_4px_16px_rgba(147,51,234,0.4)]"
                  : "text-purple-300/60 hover:text-purple-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-8 sm:px-10 pb-10">
          {/* Alert message */}
          {message && (
            <div
              className={`mb-5 px-4 py-3 rounded-xl text-sm text-center border flex items-center justify-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-300"
                  : "bg-red-400/10 border-red-400/25 text-red-300"
              }`}
            >
              {message.type === "success" ? (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name (signup only) */}
            {mode === "signup" && (
              <div
                style={{ animation: "fadeSlide 0.35s ease forwards" }}
                className="flex gap-3"
              >
                {/* First Name */}
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/60 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      autoComplete="given-name"
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/60 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      autoComplete="family-name"
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/60 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={inputBase}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/60 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={
                    mode === "signup"
                      ? "Create a strong password"
                      : "Enter your password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className={`${inputBase} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {mode === "login" && (
                <div className="text-right mt-1.5">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[11px] text-purple-400/60 hover:text-purple-300 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {/* Phone numbers (signup only) */}
            {mode === "signup" && (
              <div
                style={{ animation: "fadeSlide 0.35s ease forwards" }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest">
                    Mobile Numbers
                  </label>
                  <button
                    type="button"
                    onClick={addPhone}
                    className="text-[11px] text-purple-300/70 hover:text-purple-200 transition-colors"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2">
                  {(form.phoneNumbers || []).map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={p.label ?? ""}
                        onChange={(e) => updatePhone(idx, "label", e.target.value)}
                        placeholder="Label"
                        className={`${inputPlain} w-[110px]`}
                      />
                      <input
                        type="tel"
                        value={p.number ?? ""}
                        onChange={(e) => updatePhone(idx, "number", e.target.value)}
                        placeholder="Mobile number"
                        className={inputPlain}
                      />
                      <button
                        type="button"
                        onClick={() => removePhone(idx)}
                        disabled={(form.phoneNumbers || []).length <= 1}
                        className="p-2 rounded-xl border border-purple-400/20 bg-white/5 text-purple-200/70 hover:text-red-200 hover:border-red-400/30 hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Remove phone"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-purple-200/40 leading-relaxed">
                  You can add more than one number (e.g. Primary, Work, Home).
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full mt-2 py-3.5 rounded-2xl text-white text-sm font-semibold tracking-wide overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(147,51,234,0.6)] active:translate-y-0 shadow-[0_8px_24px_rgba(147,51,234,0.45)]"
              style={{
                background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 55%, #a855f7 100%)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                {loading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-purple-500/15" />
            <span className="text-[10px] text-purple-400/40 tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-purple-500/15" />
          </div>

          {/* Switch mode */}
          <p className="text-center text-sm text-purple-300/50">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="text-purple-300 font-medium hover:text-white underline underline-offset-2 transition-colors duration-200"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}