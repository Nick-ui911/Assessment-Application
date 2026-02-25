import { useState, useEffect } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      desc: "Blazing performance with sub-100ms response times. Your users will never wait.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Enterprise Security",
      desc: "Bank-grade encryption and compliance built-in from day one. Sleep soundly.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Deep Analytics",
      desc: "Real-time insights and dashboards that make data-driven decisions effortless.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Team Collaboration",
      desc: "Work seamlessly across teams with real-time sync and granular permissions.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Auto Scaling",
      desc: "Grows with your business automatically. No ops headaches, ever.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Developer API",
      desc: "Powerful REST & GraphQL APIs with SDKs for every major language.",
    },
  ];

  
  return (
    <div className="min-h-screen bg-[#0e001f] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0e001f]/90 backdrop-blur-xl border-b border-purple-500/10 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_4px_16px_rgba(147,51,234,0.4)]">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Aura<span className="text-purple-400">X</span>
              </span>
            </div>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/auth"
                className="px-5 py-2 text-sm font-medium text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400/60 rounded-xl transition-all duration-200 hover:bg-purple-500/10"
              >
                Log in
              </a>
              <a
                href="/auth"
                className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(147,51,234,0.4)] hover:shadow-[0_8px_24px_rgba(147,51,234,0.5)]"
                style={{ background: "linear-gradient(135deg, #6d28d9, #9333ea)" }}
              >
                Get started free
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-purple-300 hover:text-white transition-colors"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-purple-500/10 bg-[#0e001f]/95 backdrop-blur-xl px-4 py-4 space-y-3">
            {["Features", "Pricing", "Docs", "Blog"].map((item) => (
              <a key={item} href="#" className="block text-sm text-purple-200/60 hover:text-white py-2 font-medium transition-colors">
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <a href="/auth" className="text-center py-2.5 text-sm font-medium text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 transition-all">
                Log in
              </a>
              <a href="/auth" className="text-center py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: "linear-gradient(135deg, #6d28d9, #9333ea)" }}>
                Get started free
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-purple-800/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-700/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-700/10 blur-[80px] pointer-events-none" />

        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(147,51,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div
          className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Now in public beta — try it free
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The platform that
            <span className="block mt-1" style={{ background: "linear-gradient(135deg, #c084fc, #9333ea, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              powers your growth
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-purple-200/60 leading-relaxed mb-10 mt-6 font-light">
            AuraX gives your team the tools to ship faster, scale smarter, and delight your customers — all in one beautifully crafted platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a
              href="/auth"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_32px_rgba(147,51,234,0.45)] hover:shadow-[0_16px_48px_rgba(147,51,234,0.6)]"
              style={{ background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 55%, #a855f7 100%)" }}
            >
              Start for free →
            </a>
           
          </div>

          {/* Floating dashboard mockup */}
          <div
            className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden border border-purple-500/20"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(147,51,234,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Mockup topbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-500/10 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 mx-4 h-6 rounded-lg bg-white/5 flex items-center px-3">
                <span className="text-[10px] text-purple-400/40">app.aurax.io/dashboard</span>
              </div>
            </div>

            {/* Mockup content */}
            <div className="p-4 sm:p-6 grid grid-cols-3 gap-3 sm:gap-4">
              {/* Stat cards */}
              {[
                { label: "Revenue", val: "$128,430", color: "from-violet-600/20 to-purple-600/10", up: "+12.4%" },
                { label: "Active Users", val: "24,812", color: "from-fuchsia-600/20 to-pink-600/10", up: "+8.1%" },
                { label: "Conversions", val: "4.73%", color: "from-indigo-600/20 to-blue-600/10", up: "+2.3%" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl p-3 sm:p-4 bg-gradient-to-br ${s.color} border border-white/5`}>
                  <div className="text-[10px] sm:text-xs text-purple-300/50 mb-1">{s.label}</div>
                  <div className="text-sm sm:text-xl font-bold text-white">{s.val}</div>
                  <div className="text-[10px] sm:text-xs text-emerald-400 mt-1">{s.up}</div>
                </div>
              ))}

              {/* Chart area */}
              <div className="col-span-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 h-28 sm:h-36 flex items-end gap-1.5">
                {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88, 82, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, background: `linear-gradient(to top, #6d28d9, #c084fc)`, opacity: 0.6 + i * 0.03 }} />
                ))}
              </div>

              {/* Recent activity */}
              <div className="col-span-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4 space-y-2.5">
                {["User signup: john@example.com", "Payment received: $299", "New integration: Stripe connected"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs text-purple-200/40">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 sm:py-28 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-800/10 blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything you need,
              <span className="block text-purple-400">nothing you don't</span>
            </h2>
            <p className="mt-4 text-purple-200/50 max-w-xl mx-auto text-base leading-relaxed">
              A thoughtfully curated toolkit that removes complexity and lets your team focus on what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-purple-500/15 hover:border-purple-500/35 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.025)", backdropFilter: "blur(8px)" }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "radial-gradient(circle at top left, rgba(147,51,234,0.08), transparent 60%)" }}
                />
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-purple-200/45 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA BANNER ── */}
      <section className="py-20 sm:py-28 relative border-t border-purple-500/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(109,40,217,0.15) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to build something{" "}
            <span style={{ background: "linear-gradient(135deg, #c084fc, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              remarkable?
            </span>
          </h2>
          <p className="text-purple-200/50 text-base sm:text-lg mb-8 leading-relaxed">
            Join thousands of teams already using AuraX. Start for free, upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/signup"
              className="px-8 py-3.5 text-base font-semibold text-white rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_32px_rgba(147,51,234,0.4)] hover:shadow-[0_16px_48px_rgba(147,51,234,0.6)]"
              style={{ background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 55%, #a855f7 100%)" }}
            >
              Start for free →
            </a>
            <a
              href="/login"
              className="px-8 py-3.5 text-base font-medium text-purple-300 rounded-2xl border border-purple-500/25 hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-white transition-all duration-300"
            >
              Log in to your account
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-purple-500/10 py-10 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>AuraX</span>
            </div>

            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Docs", "Status"].map((item) => (
                <a key={item} href="#" className="text-xs text-purple-300/40 hover:text-purple-300 transition-colors">
                  {item}
                </a>
              ))}
            </div>

            <p className="text-xs text-purple-300/30">© 2025 AuraX. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}