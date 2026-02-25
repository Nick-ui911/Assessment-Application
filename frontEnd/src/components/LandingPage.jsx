import { useState, useEffect } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      desc: "Blazing performance with sub-100ms response times. Your users will never wait.",
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Enterprise Security",
      desc: "Bank-grade encryption and compliance built-in from day one. Sleep soundly.",
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Deep Analytics",
      desc: "Real-time insights and dashboards that make data-driven decisions effortless.",
      accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Team Collaboration",
      desc: "Work seamlessly across teams with real-time sync and granular permissions.",
      accent: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Auto Scaling",
      desc: "Grows with your business automatically. No ops headaches, ever.",
      accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Developer API",
      desc: "Powerful REST & GraphQL APIs with SDKs for every major language.",
      accent: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
  ];

  const bgStyle = {
    backgroundImage:
      "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">


      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden" style={bgStyle}>
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className={`relative z-10 max-w-5xl mx-auto px-6 text-center transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Now in public beta — try it free
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight tracking-tight mb-6" style={{ fontFamily: "'Georgia', serif" }}>
            The platform that
            <span
              className="block mt-1 text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #34d399)" }}
            >
              powers your growth
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10 font-light">
            Assessment Builder gives your team the tools to ship faster, scale smarter, and delight your customers — all in one beautifully crafted platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a
              href="/auth"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-150 shadow-lg shadow-indigo-500/25"
            >
              Start for free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Dashboard mockup */}
          <div className="relative mx-auto max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-800/50">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="flex-1 mx-4 h-5 rounded-lg bg-slate-700/60 flex items-center px-3">
                <span className="text-[10px] text-slate-500">app.assessmentbuilder.io/dashboard</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "Assessments", val: "24", color: "text-indigo-400", up: "+3 this week" },
                { label: "Students", val: "1,248", color: "text-emerald-400", up: "+82 today" },
                { label: "Avg. Score", val: "76%", color: "text-amber-400", up: "+2.1%" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-xl p-3 sm:p-4">
                  <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                  <div className={`text-sm sm:text-xl font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 mt-1">{s.up}</div>
                </div>
              ))}

              {/* Bar chart */}
              <div className="col-span-3 bg-slate-800 border border-slate-700 rounded-xl p-4 h-28 sm:h-36 flex items-end gap-1.5">
                {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88, 82, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{ height: `${h}%`, background: `linear-gradient(to top, #4f46e5, #818cf8)`, opacity: 0.5 + i * 0.04 }}
                  />
                ))}
              </div>

              {/* Activity */}
              <div className="col-span-3 bg-slate-800 border border-slate-700 rounded-xl p-3 sm:p-4 space-y-2.5">
                {["Student submitted: React Fundamentals Quiz", "New assessment created: SQL Basics", "Auto-graded 48 submissions in 0.4s"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs text-slate-500">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute top-1/3 -right-4 hidden lg:block bg-slate-900 border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-xl">
            <p className="text-emerald-400 text-xl font-bold leading-none">94%</p>
            <p className="text-slate-500 text-xs mt-0.5">Top score</p>
          </div>
          <div className="absolute top-1/2 -left-4 hidden lg:block bg-slate-900 border border-indigo-500/30 rounded-xl px-3 py-2.5 shadow-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-indigo-300 text-xs font-medium">Auto-graded in 0.3s</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 sm:py-28 bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              Platform Features
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
              Everything you need,
              <span className="block text-transparent bg-clip-text mt-1" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #34d399)" }}>
                nothing you don't
              </span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto text-base leading-relaxed font-light">
              A thoughtfully curated toolkit that removes complexity and lets your team focus on what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${f.accent}`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={bgStyle}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-indigo-500/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-indigo-500/5 rounded-full pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
            Ready to build something{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #34d399)" }}>
              remarkable?
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-10 leading-relaxed font-light">
            Join thousands of teams already using Assessment Builder. Start for free, upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/auth"
              className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-150 shadow-lg shadow-indigo-500/25"
            >
              Start for free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/auth"
              className="px-8 py-3.5 text-sm font-medium text-slate-300 rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-800 hover:text-white transition-all duration-150"
            >
              Log in to your account
            </a>
          </div>
          <p className="text-slate-600 text-xs mt-6">No credit card required · Free forever for individuals</p>
        </div>
      </section>

    </div>
  );
}