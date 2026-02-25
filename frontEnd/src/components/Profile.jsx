import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { setUser, logout } from "../ReduxSlices/userSlice";

const Profile = () => {
  const user = useSelector((store) => store.user.user);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", address: "", phoneNumbers: [] });
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);

  const phones = Array.isArray(user?.phoneNumbers) ? user.phoneNumbers : [];

  const openEdit = () => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      address: user?.address ?? "",
      phoneNumbers: phones.length
        ? phones.map((p) => ({ number: p.number || "", label: p.label || "Primary" }))
        : [{ number: "", label: "Primary" }],
    });
    setMessage(null);
    setIsEditing(true);
  };

  const closeEdit = () => { setIsEditing(false); setMessage(null); };

  const addPhone = () => {
    setForm((f) => ({ ...f, phoneNumbers: [...f.phoneNumbers, { number: "", label: "Primary" }] }));
  };

  const removePhone = (index) => {
    setForm((f) => ({ ...f, phoneNumbers: f.phoneNumbers.filter((_, i) => i !== index) }));
  };

  const updatePhone = (index, field, value) => {
    setForm((f) => ({ ...f, phoneNumbers: f.phoneNumbers.map((p, i) => i === index ? { ...p, [field]: value } : p) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        phoneNumbers: form.phoneNumbers.filter((p) => p.number.trim() !== ""),
      };
      const { data } = await axiosInstance.patch("/users/profile", payload);
      dispatch(setUser({ ...user, ...data }));
      setMessage({ type: "success", text: "Profile updated successfully." });
      setTimeout(() => { setIsEditing(false); setMessage(null); }, 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !user) return <Navigate to="/auth" replace />;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  const inputCls =
    "w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 outline-none transition-all duration-150 border border-slate-700 bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  const bgStyle = {
    backgroundImage:
      "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)",
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12" style={bgStyle}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">Assessment Builder</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">My Profile</h1>
              <p className="text-slate-400 mt-1 text-sm">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={openEdit}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-indigo-500/20 flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={closeEdit}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 flex-shrink-0"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Alert */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2 border ${
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

        {/* Avatar card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">{user.firstName} {user.lastName}</h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
            {user?.role === "admin" && (
              <span className="inline-block mt-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wide">Admin</span>
            )}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            {isEditing ? "Edit Information" : "Profile Details"}
          </h2>

          {!isEditing ? (
            /* ── View mode ── */
            <div className="space-y-0 divide-y divide-slate-800">
              {[
                { label: "First Name", value: user.firstName },
                { label: "Last Name", value: user.lastName },
                { label: "Email", value: user.email },
                { label: "Address", value: user.address },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <span className="text-slate-500 text-sm">{label}</span>
                  <span className="text-white text-sm font-medium">{value || <span className="text-slate-600">—</span>}</span>
                </div>
              ))}

              {/* Phone dropdown */}
              <div className="flex items-center justify-between py-4 last:pb-0">
                <span className="text-slate-500 text-sm">Phone Numbers</span>
                {phones.length > 0 ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setPhoneDropdownOpen((o) => !o)}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded-xl transition-all"
                    >
                      {phones.length} number{phones.length !== 1 ? "s" : ""}
                      <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${phoneDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {phoneDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setPhoneDropdownOpen(false)} />
                        <ul className="absolute right-0 top-full mt-1 w-56 py-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                          {phones.map((p, i) => (
                            <li key={i} className="px-4 py-2.5 border-b border-slate-800 last:border-0">
                              <span className="text-indigo-400 text-xs font-medium">{p.label || "Primary"}</span>
                              <p className="text-white text-sm font-medium mt-0.5">{p.number || "—"}</p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-600 text-sm">No numbers added</span>
                )}
              </div>
            </div>
          ) : (
            /* ── Edit mode ── */
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="First name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="Last name"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <p className="text-slate-500 text-xs mb-1">Email cannot be changed here.</p>
                <div className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-800 text-slate-400 text-sm">{user.email}</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Your address"
                  className={inputCls}
                />
              </div>

              {/* Phone numbers */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-medium text-slate-400">Phone Numbers</label>
                  <button type="button" onClick={addPhone} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    + Add number
                  </button>
                </div>
                <div className="space-y-2.5">
                  {form.phoneNumbers.map((p, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={p.label}
                        onChange={(e) => updatePhone(i, "label", e.target.value)}
                        placeholder="Label"
                        className={`${inputCls} w-[100px]`}
                      />
                      <input
                        type="tel"
                        value={p.number}
                        onChange={(e) => updatePhone(i, "number", e.target.value)}
                        placeholder="Phone number"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => removePhone(i)}
                        className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-indigo-500/20"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;