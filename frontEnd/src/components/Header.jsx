import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../ReduxSlices/userSlice";
import axiosInstance from "../utils/axios";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const [loggingOut, setLoggingOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axiosInstance.post("/auth/logout");
      navigate("/", { replace: true });
      dispatch(logout());
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/", { replace: true });
      dispatch(logout());
    } finally {
      setLoggingOut(false);
    }
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "U";

  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "User";

  const navLinks = [
    ...(!isAdmin
      ? [
          { label: "Home", href: "/home" },
          { label: "Assessments", href: "/assessments" },
          { label: "My Results", href: "/my-results" },
        ]
      : []),
    ...(isAdmin
      ? [
          { label: "All Assessments", href: "/admin/assessments" },
          { label: "Create Assessment", href: "/admin/create" },
        ]
      : []),
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">Assessment Builder</span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-2">

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-800 transition-all duration-150"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>

                  <div className="hidden sm:block text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white leading-none">{fullName}</p>
                      {isAdmin && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 tracking-wide uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-none">{user?.email ?? ""}</p>
                  </div>

                  <svg className="w-3.5 h-3.5 text-slate-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 z-20 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-white text-sm font-medium truncate">{fullName}</p>
                        <p className="text-slate-500 text-xs truncate mt-0.5">{user?.email ?? ""}</p>
                      </div>

                      <div className="p-1.5 space-y-0.5">
                        <a
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </a>

                        {isAdmin && (
                          <a
                            href="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-150"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Admin Dashboard
                          </a>
                        )}
                      </div>

                      <div className="h-px bg-slate-800 mx-1.5" />

                      <div className="p-1.5">
                        <button
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 disabled:opacity-50"
                        >
                          {loggingOut ? (
                            <>
                              <div className="w-3.5 h-3.5 rounded-full border border-red-400 border-t-transparent animate-spin" />
                              Signing out...
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Sign Out
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                {mobileMenuOpen ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3">
            <div className="space-y-0.5 mb-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="h-px bg-slate-800 mb-3" />
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-150 disabled:opacity-50"
            >
              {loggingOut ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border border-red-400 border-t-transparent animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </>
              )}
            </button>
          </div>
        )}
      </header>

      <div className="h-16" />
    </>
  );
}