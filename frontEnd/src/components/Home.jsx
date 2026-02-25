import { useState, useEffect, useRef } from "react";


const FEATURES = [
  {
    icon: "✦",
    title: "Intelligent Workflows",
    desc: "AI learns your patterns and automates the repetitive, so you can focus on the creative.",
    accent: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
  },
  {
    icon: "⚡",
    title: "Real-time Sync",
    desc: "Collaborate with your entire team simultaneously. Zero lag, infinite possibility.",
    accent: "from-purple-500 to-fuchsia-500",
    bg: "bg-purple-50",
  },
  {
    icon: "🔮",
    title: "Predictive Analytics",
    desc: "See what's coming before it arrives. Data that thinks ahead.",
    accent: "from-fuchsia-500 to-violet-600",
    bg: "bg-fuchsia-50",
  },
  {
    icon: "🛡",
    title: "Enterprise Security",
    desc: "SOC 2 Type II, end-to-end encryption, and GDPR-ready from day one.",
    accent: "from-violet-600 to-purple-700",
    bg: "bg-violet-50",
  },
  {
    icon: "🔗",
    title: "400+ Integrations",
    desc: "Connects with every tool your team already loves. Plug in and go.",
    accent: "from-purple-400 to-violet-500",
    bg: "bg-purple-50",
  },
  {
    icon: "∞",
    title: "Infinite Scale",
    desc: "From solo founder to Fortune 500. Luminae grows as you grow.",
    accent: "from-violet-500 to-indigo-600",
    bg: "bg-indigo-50",
  },
];

const STATS = [
  { value: "4.2×", label: "Avg. productivity boost" },
  { value: "12k+", label: "Teams worldwide" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<50ms", label: "Global latency" },
];

const TESTIMONIALS = [
  {
    quote: "Luminae transformed how we think about shipping. We moved from quarterly releases to daily deployments without breaking a sweat.",
    name: "Aria Chen",
    role: "CTO · Vela Systems",
    initial: "A",
    color: "from-violet-500 to-purple-600",
  },
  {
    quote: "The AI layer is genuinely magical. It feels like having a senior engineer who never sleeps and never complains.",
    name: "Marcus Webb",
    role: "Head of Engineering · Drift",
    initial: "M",
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    quote: "Our entire design-to-production pipeline is now 60% faster. I didn't think that was achievable without hiring 20 more people.",
    name: "Leila Nasser",
    role: "VP Product · Arcane Labs",
    initial: "L",
    color: "from-fuchsia-500 to-violet-600",
  },
];


function HeroCard() {
  return (
    <div className="relative anim-float">
      <div className="bg-white rounded-3xl shadow-2xl border border-violet-100 p-6 w-80">
        {/* Top line accent */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent rounded-full" />

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-widest uppercase text-violet-400 font-medium">Team Velocity</p>
          <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">Live</span>
        </div>

        <div className="font-display text-5xl font-light text-violet-950 mb-1">↑ 4.2×</div>
        <p className="text-xs text-violet-400 mb-5">Productivity · This Quarter</p>

        {[
          { label: "Design", pct: "87%" },
          { label: "Dev", pct: "73%", delay: "delay-200" },
          { label: "Growth", pct: "94%", delay: "delay-400" },
        ].map(({ label, pct, delay = "" }) => (
          <div key={label} className="flex items-center gap-3 mb-3">
            <span className="text-xs text-violet-500 w-12 flex-shrink-0">{label}</span>
            <div className="flex-1 h-1.5 bg-violet-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 anim-bar ${delay}`}
                style={{ width: pct }}
              />
            </div>
            <span className="text-xs text-violet-400 w-8 text-right">{pct}</span>
          </div>
        ))}

        <div className="mt-5 pt-4 border-t border-violet-50 flex items-center gap-2">
          <div className="flex -space-x-2">
            {["A", "M", "K", "S"].map((l, i) => (
              <div
                key={l}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                style={{ zIndex: 4 - i }}
              >
                {l}
              </div>
            ))}
          </div>
          <span className="text-xs text-violet-400">+840 joined this week</span>
        </div>
      </div>

      {/* Floating badge top-right */}
      <div className="anim-float-delay absolute -top-5 -right-8 bg-violet-700 text-white rounded-2xl px-4 py-3 shadow-xl">
        <div className="font-display text-2xl font-light leading-none">98%</div>
        <div className="text-xs text-violet-200 mt-0.5">Satisfaction</div>
      </div>

      {/* Floating badge bottom-left */}
      <div className="anim-float-delay absolute -bottom-4 -left-8 bg-white border border-violet-100 rounded-xl px-3 py-2.5 shadow-lg flex items-center gap-2">
        <div className="relative ring-pulse w-2 h-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
        </div>
        <span className="text-xs text-violet-700 font-medium">2,341 active now</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="mesh-bg min-h-screen flex items-center pt-16 overflow-hidden relative">
      {/* Background orbs */}
      <div className="hero-orb w-96 h-96 bg-violet-200 opacity-40" style={{ top: "5%", right: "5%" }} />
      <div className="hero-orb w-64 h-64 bg-purple-300 opacity-30" style={{ bottom: "15%", left: "5%" }} />

      {/* Spinning ring decoration */}
      <div
        className="anim-spin-slow absolute opacity-10 border-2 border-dashed border-violet-400 rounded-full"
        style={{ width: 500, height: 500, top: "50%", right: "-10%", transform: "translateY(-50%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-20 items-center w-full">
        {/* Left */}
        <div>
          <div className="anim-fade-up inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-violet-500 mb-6">
            <span className="w-6 h-px bg-violet-400" />
            Redefining What Teams Can Do
          </div>

          <h1 className="anim-fade-up delay-100 font-display text-6xl lg:text-7xl font-light leading-none text-violet-950 mb-6 tracking-tight">
            Where{" "}
            <span className="italic shimmer-text">vision</span>
            <br />
            meets
            <br />
            velocity
          </h1>

          <p className="anim-fade-up delay-200 text-lg text-violet-500 font-light leading-relaxed max-w-md mb-10">
            Luminae is the operating layer for ambitious teams — combining AI automation, real-time collaboration, and deep analytics into one seamless platform.
          </p>

          {/* Trust strip */}
          <div className="anim-fade-up delay-400 mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["D", "R", "L", "K", "F"].map((l) => (
                <div
                  key={l}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-300 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-medium text-violet-800">Trusted by 12,000+ teams</div>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-violet-400 text-xs">★</span>
                ))}
                <span className="text-xs text-violet-400 ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="anim-fade-up delay-300 flex justify-center lg:justify-end pr-12">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-white border-y border-violet-100 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl font-light text-violet-800 mb-1">{value}</div>
              <div className="text-xs text-violet-400 tracking-wide font-light uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="bg-violet-950 py-28 relative overflow-hidden">
      {/* Decorative mesh */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(139,92,246,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(167,139,250,0.3) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs tracking-widest uppercase text-violet-400 font-medium mb-4">Capabilities</p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-white leading-tight mb-4">
            Everything you need,{" "}
            <span className="italic text-violet-300">nothing you don't</span>
          </h2>
          <p className="text-violet-400 font-light leading-relaxed">
            A platform that gets out of your way and lets you focus on the work that actually matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc, bg }, i) => (
            <div
              key={title}
              className="feature-card-hover card-glow bg-white/5 border border-white/10 rounded-2xl p-6 cursor-default"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-5">
                {icon}
              </div>
              <h3 className="font-display text-lg font-medium text-white mb-2">{title}</h3>
              <p className="text-sm text-violet-300 font-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];

  return (
    <section className="bg-white py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-xs tracking-widest uppercase text-violet-400 font-medium mb-12">
          Loved by builders
        </p>

        <div className="relative min-h-48">
          <p className="font-display text-3xl lg:text-4xl font-light italic text-violet-950 leading-snug mb-8 transition-all duration-300">
            "{t.quote}"
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-semibold text-lg`}
          >
            {t.initial}
          </div>
          <div className="text-left">
            <div className="font-medium text-violet-950 text-sm">{t.name}</div>
            <div className="text-xs text-violet-400">{t.role}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-violet-600" : "w-4 bg-violet-200 hover:bg-violet-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="purple-mesh py-28 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <div className="inline-block bg-violet-800/40 border border-violet-500/30 rounded-full px-4 py-1.5 text-xs text-violet-200 tracking-widest uppercase font-medium mb-8">
          Start Today · No Credit Card
        </div>
        <h2 className="font-display text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
          Ready to{" "}
          <span className="italic text-violet-300">illuminate</span>
          <br />
          your potential?
        </h2>
        <p className="text-violet-300 font-light text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Join 12,000+ teams already building the future. Free forever for individuals, no card required.
        </p>
      </div>

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-violet-500/20 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-violet-500/10 rounded-full pointer-events-none" />
    </section>
  );
}

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <CTA />
      </main>
    </>
  );
}