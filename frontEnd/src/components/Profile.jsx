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
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumbers: [],
  });
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);

  const phones = Array.isArray(user?.phoneNumbers) ? user.phoneNumbers : [];

  const openEdit = () => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      address: user?.address ?? "",
      phoneNumbers: phones.length
        ? phones.map((p) => ({
            number: p.number || "",
            label: p.label || "Primary",
          }))
        : [{ number: "", label: "Primary" }],
    });
    setMessage(null);
    setIsEditing(true);
  };

  const closeEdit = () => {
    setIsEditing(false);
    setMessage(null);
  };

  const addPhone = () => {
    setForm((f) => ({
      ...f,
      phoneNumbers: [...f.phoneNumbers, { number: "", label: "Primary" }],
    }));
  };

  const removePhone = (index) => {
    setForm((f) => ({
      ...f,
      phoneNumbers: f.phoneNumbers.filter((_, i) => i !== index),
    }));
  };

  const updatePhone = (index, field, value) => {
    setForm((f) => ({
      ...f,
      phoneNumbers: f.phoneNumbers.map((p, i) =>
        i === index ? { ...p, [field]: value } : p,
      ),
    }));
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
      dispatch(
        setUser({
          ...user,
          ...data,
        }),
      );
      setMessage({ type: "success", text: "Profile updated successfully." });
      setTimeout(() => {
        setIsEditing(false);
        setMessage(null);
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-[#150030] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={openEdit}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Edit profile
              </button>
            ) : (
              <button
                type="button"
                onClick={closeEdit}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-purple-500/50 text-purple-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl text-sm border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                : "bg-red-500/10 border-red-400/30 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-purple-300 text-sm block mb-1">
                  First Name
                </label>
                <p className="text-white text-lg">{user.firstName || "N/A"}</p>
              </div>
              <div>
                <label className="text-purple-300 text-sm block mb-1">
                  Last Name
                </label>
                <p className="text-white text-lg">{user.lastName || "N/A"}</p>
              </div>
              <div>
                <label className="text-purple-300 text-sm block mb-1">
                  Email
                </label>
                <p className="text-white text-lg">{user.email || "N/A"}</p>
              </div>
              {user?.role === "admin" && (
                <div>
                  <label className="text-purple-300 text-sm block mb-1">
                    Role
                  </label>
                  <p className="text-white text-lg">Admin</p>
                </div>
              )}
              <div>
                <label className="text-purple-300 text-sm block mb-1">
                  Address
                </label>
                <p className="text-white text-lg">{user.address || "N/A"}</p>
              </div>
              <div>
                <label className="text-purple-300 text-sm block mb-1">
                  Phone Numbers
                </label>
                {phones.length > 0 ? (
                  <div className="relative inline-block min-w-[200px]">
                    <button
                      type="button"
                      onClick={() => setPhoneDropdownOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-white/5 text-white text-left hover:border-purple-500/50 transition-colors"
                    >
                      <span>
                        {phones.length} number{phones.length !== 1 ? "s" : ""}
                      </span>
                      <svg
                        className={`w-4 h-4 text-purple-400 transition-transform ${phoneDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {phoneDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          aria-hidden
                          onClick={() => setPhoneDropdownOpen(false)}
                        />
                        <ul className="absolute left-0 right-0 top-full mt-1 py-1 rounded-xl border border-purple-500/30 bg-[#1a0040] shadow-xl z-20 max-h-48 overflow-auto">
                          {phones.map((p, i) => (
                            <li
                              key={i}
                              className="px-4 py-2.5 text-white border-b border-purple-500/10 last:border-0"
                            >
                              <span className="text-purple-300 text-xs">
                                {p.label || "Primary"}
                              </span>
                              <p className="text-white font-medium">
                                {p.number || "—"}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-white/60">No phone numbers</p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-purple-300 text-sm block mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="text-purple-300 text-sm block mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-purple-300 text-sm block mb-1.5">
                  Email
                </label>
                <p className="text-white/50 text-sm">
                  Email cannot be changed here.
                </p>
                <p className="text-white break-all">{user.email}</p>
              </div>

              {/* Address */}
              <div>
                <label className="text-purple-300 text-sm block mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  placeholder="Address"
                />
              </div>

              {/* Phone Numbers */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <label className="text-purple-300 text-sm">
                    Phone Numbers
                  </label>
                  <button
                    type="button"
                    onClick={addPhone}
                    className="text-sm text-purple-400 hover:text-purple-300 transition"
                  >
                    + Add number
                  </button>
                </div>

                <div className="space-y-4">
                  {form.phoneNumbers.map((p, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row gap-3 sm:items-center"
                    >
                      <input
                        type="text"
                        value={p.label}
                        onChange={(e) =>
                          updatePhone(i, "label", e.target.value)
                        }
                        placeholder="Label"
                        className="w-full sm:w-28 px-3 py-2 rounded-lg bg-white/5 border border-purple-500/30 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                      />

                      <input
                        type="tel"
                        value={p.number}
                        onChange={(e) =>
                          updatePhone(i, "number", e.target.value)
                        }
                        placeholder="Number"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                      />

                      <button
                        type="button"
                        onClick={() => removePhone(i)}
                        className="self-start sm:self-auto p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition"
                        aria-label="Remove phone"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all duration-200 shadow-[0_4px_14px_rgba(147,51,234,0.4)]"
                >
                  {saving ? "Saving..." : "Save changes"}
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
