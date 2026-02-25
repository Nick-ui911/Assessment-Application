import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

export default function ForgotPassword() {
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const navigate = useNavigate();

  const [step, setStep] = useState("request"); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      setMessage({
        type: "success",
        text: data?.message || "OTP sent to your email address.",
      });
      setStep("reset");
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Unable to send OTP. Please check the email and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Password and confirm password do not match.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const { data } = await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });
      setMessage({
        type: "success",
        text: data?.message || "Password reset successful. Redirecting to login...",
      });
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Invalid OTP or expired. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/25 outline-none transition-all duration-200 border border-purple-400/25 bg-white/5 focus:border-purple-500/80 focus:bg-white/[0.08] focus:ring-2 focus:ring-purple-500/25";

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
        className="relative z-10 w-full max-w-md mx-4 my-8 rounded-3xl overflow-hidden border border-purple-400/25"
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
            background:
              "linear-gradient(90deg, transparent, #c084fc, transparent)",
          }}
        />

        {/* Header */}
        <div className="pt-10 pb-6 px-8 sm:px-10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_8px_32px_rgba(147,51,234,0.5)]">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11zM5 20.5C5 17.462 8.134 15 12 15s7 2.462 7 5.5"
                />
              </svg>
            </div>
            <div className="absolute inset-[-3px] rounded-full border border-purple-400/30" />
          </div>

          <h1
            className="text-[1.75rem] font-bold text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {step === "request"
              ? "Reset your password"
              : "Enter OTP & new password"}
          </h1>
          <p className="mt-1.5 text-sm text-purple-300/70 font-light tracking-wide">
            {step === "request"
              ? "We’ll send a one-time code to your email."
              : "Check your email for the OTP and choose a new password."}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 sm:px-10 pb-10">
          {message && (
            <div
              className={`mb-5 px-4 py-3 rounded-xl text-sm text-center border flex items-center justify-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-300"
                  : "bg-red-400/10 border-red-400/25 text-red-300"
              }`}
            >
              {message.type === "success" ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {message.text}
            </div>
          )}

          {step === "request" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputBase}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full mt-2 py-3.5 rounded-2xl text-white text-sm font-semibold tracking-wide overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(147,51,234,0.6)] active:translate-y-0 shadow-[0_8px_24px_rgba(147,51,234,0.45)]"
                style={{
                  background:
                    "linear-gradient(135deg, #6d28d9 0%, #9333ea 55%, #a855f7 100%)",
                }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? "Sending OTP..." : "Send OTP"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="w-full mt-2 text-xs text-purple-200/70 hover:text-white underline underline-offset-2"
              >
                Back to login
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                  OTP
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the code from your email"
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a new password"
                    className={`${inputBase} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-purple-300/70 uppercase tracking-widest mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat the new password"
                    className={`${inputBase} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-300 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full mt-2 py-3.5 rounded-2xl text-white text-sm font-semibold tracking-wide overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(147,51,234,0.6)] active:translate-y-0 shadow-[0_8px_24px_rgba(147,51,234,0.45)]"
                style={{
                  background:
                    "linear-gradient(135deg, #6d28d9 0%, #9333ea 55%, #a855f7 100%)",
                }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? "Resetting..." : "Reset password"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStep("request")}
                className="w-full mt-2 text-xs text-purple-200/70 hover:text-white underline underline-offset-2"
              >
                Resend OTP to email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}