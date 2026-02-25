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

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (mode === "signup") {
      const phoneRegex = /^\d{10}$/;
      const invalidPhone = (form.phoneNumbers || []).some((p) => {
        const number = (p?.number ?? "").trim();
        return number && !phoneRegex.test(number);
      });
      if (invalidPhone) {
        setMessage({ type: "error", text: "One or more phone numbers are invalid." });
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

      const res = await axiosInstance.post(`${BASE_URL}${endpoint}`, payload);

      if (mode === "login") {
        dispatch(setUser(res.data.user ?? res.data));
        navigate("/profile");
      } else {
        setMessage({ type: "success", text: res.data.message || "Account created successfully!" });
        dispatch(setUser(res.data.user ?? res.data));
        navigate("/profile");
      }

      setForm({ firstName: "", lastName: "", email: "", password: "", phoneNumbers: [{ number: "", label: "Primary" }] });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({ firstName: "", lastName: "", email: "", password: "", phoneNumbers: [{ number: "", label: "Primary" }] });
    setMessage(null);
    setShowPassword(false);
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 outline-none transition-all duration-150 border border-slate-700 bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  const inputPlain =
    "w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 outline-none transition-all duration-150 border border-slate-700 bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  const addPhone = () => {
    setForm((f) => ({ ...f, phoneNumbers: [...(f.phoneNumbers || []), { number: "", label: "Mobile" }] }));
  };

  const removePhone = (index) => {
    setForm((f) => ({ ...f, phoneNumbers: (f.phoneNumbers || []).filter((_, i) => i !== index) }));
  };

  const updatePhone = (index, field, value) => {
    setForm((f) => ({
      ...f,
      phoneNumbers: (f.phoneNumbers || []).map((p, i) => i === index ? { ...p, [field]: value } : p),
    }));
  };

  const bgStyle = {
    backgroundImage:
      "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)",
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950" style={bgStyle}>
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 my-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* Header */}
        <div className="pt-10 pb-6 px-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-1">Assessment Builder</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-slate-400 font-light">
            {mode === "login" ? "Sign in to continue" : "Join and get started today"}
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-8 mb-6 flex gap-1 p-1 rounded-xl bg-slate-800 border border-slate-700">
          {[{ key: "login", label: "Sign In" }, { key: "signup", label: "Sign Up" }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-8 pb-10">
          {/* Alert */}
          {message && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2 border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {message.type === "success" ? (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name */}
            {mode === "signup" && (
              <div className="flex gap-3" style={{ animation: "fadeSlide 0.3s ease forwards" }}>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">First Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input type="text" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required autoComplete="given-name" className={inputBase} />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input type="text" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required autoComplete="family-name" className={inputBase} />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" className={inputBase} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className={`${inputBase} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-150"
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
                  <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-150">
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {/* Phone numbers */}
            {mode === "signup" && (
              <div className="space-y-2" style={{ animation: "fadeSlide 0.3s ease forwards" }}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-400">Mobile Numbers</label>
                  <button type="button" onClick={addPhone} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
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
                        className={`${inputPlain} w-[100px]`}
                      />
                      <input
                        type="tel"
                        value={p.number ?? ""}
                        onChange={(e) => updatePhone(idx, "number", e.target.value)}
                        placeholder="Phone number"
                        className={inputPlain}
                      />
                      <button
                        type="button"
                        onClick={() => removePhone(idx)}
                        disabled={(form.phoneNumbers || []).length <= 1}
                        className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600">You can add multiple numbers (e.g. Primary, Work, Home).</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-white text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Switch mode */}
          <p className="text-center text-sm text-slate-500">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors duration-150"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}