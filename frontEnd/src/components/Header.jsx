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
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/15"
        style={{
          background: "rgba(21, 0, 48, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(192,132,252,0.5) 30%, rgba(147,51,234,0.8) 50%, rgba(192,132,252,0.5) 70%, transparent 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[70px]">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_4px_16px_rgba(147,51,234,0.45)]">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2L2 7l10 5 10-5-10-5z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Aura<span className="text-purple-400">X</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-purple-200/60 hover:text-white hover:bg-purple-500/10 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-purple-500/10 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                    {initials}
                  </div>

                  <div className="hidden sm:block text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {fullName}
                      </p>

                      {isAdmin && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white">
                          ADMIN
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-purple-300/50">
                      {user?.email ?? ""}
                    </p>
                  </div>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div
                      className="absolute right-0 mt-2 w-60 z-20 rounded-2xl border border-purple-500/20 overflow-hidden"
                      style={{
                        background: "rgba(21,0,48,0.97)",
                        backdropFilter: "blur(24px)",
                      }}
                    >
                      <div className="p-2 space-y-1">
                        <a
                          href="/profile"
                          className="block px-3 py-2 rounded-xl text-sm text-purple-200/70 hover:text-white hover:bg-purple-500/10"
                        >
                          My Profile
                        </a>

                        {isAdmin && (
                          <a
                            href="/admin"
                            className="block px-3 py-2 rounded-xl text-sm text-fuchsia-400 hover:text-white hover:bg-purple-500/10"
                          >
                            Admin Dashboard
                          </a>
                        )}
                      </div>

                      <div className="mx-3 h-px bg-purple-500/15" />

                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
                        >
                          {loggingOut ? "Signing out..." : "Sign Out"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-purple-300 hover:bg-purple-500/10"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-purple-500/10 px-4 py-3"
            style={{ background: "rgba(21,0,48,0.97)" }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2 rounded-xl text-sm text-purple-200/60 hover:text-white hover:bg-purple-500/10"
              >
                {link.label}
              </a>
            ))}

            <div className="mt-3">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
              >
                {loggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="h-16 sm:h-[70px]" />
    </>
  );
}
