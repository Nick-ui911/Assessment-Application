import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Smart Assessment Builder",
    desc: "Craft MCQ and open-ended assessments in minutes. Add questions, set marks, and publish — all from one clean interface.",
    accent: "indigo",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Auto-Grading",
    desc: "Submissions are scored the moment they're submitted. No manual marking — results arrive in real time with percentage breakdowns.",
    accent: "emerald",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Performance Analytics",
    desc: "Track every student's progress. Admins see score distributions, pass rates, and trends at a glance.",
    accent: "amber",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Role-Based Access",
    desc: "Admins build and manage. Students take and review. Clear permissions keep everything in its place.",
    accent: "rose",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    title: "Question Navigator",
    desc: "Students move through exams question by question. A live panel shows answered, visited, and remaining — just like competitive exams.",
    accent: "indigo",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Full Admin Control",
    desc: "Manage users, monitor attempts, view individual results, and remove accounts — all from one powerful dashboard.",
    accent: "violet",
  },
];

const STATS = [
  { value: "∞", label: "Assessments you can create" },
  { value: "100%", label: "Auto-graded submissions" },
  { value: "<1s", label: "Result delivery time" },
  { value: "4.9★", label: "Educator satisfaction" },
];

const TESTIMONIALS = [
  {
    quote: "We replaced our entire paper-based quiz system in a week. Students get results instantly and I can see exactly where the class is struggling.",
    name: "Dr. Priya Mehta",
    role: "Professor · Delhi Institute of Technology",
    initial: "P",
  },
  {
    quote: "The question navigator alone is worth it. Students feel like they're taking a real competitive exam — focused, structured, no distractions.",
    name: "Arjun Sharma",
    role: "Training Lead · Apex Coaching",
    initial: "A",
  },
  {
    quote: "I can build a 50-question MCQ assessment, assign it, and have graded results for 200 students before the class even ends.",
    name: "Neha Kapoor",
    role: "Head of Academics · Brightpath Academy",
    initial: "N",
  },
];

const bgStyle = {
  backgroundImage:
    "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)",
};

const accentColors = {
  indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
};


function Hero() {

  return (
    <section className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden pt-20 pb-32" style={bgStyle}>
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          Assessment Builder · For Educators & Teams
        </div>

        {/* Headline */}
        <h1
          className="text-6xl md:text-8xl font-bold text-white tracking-tight leading-none mb-6"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Build.{" "}
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #34d399)" }}>
            Assess.
          </span>
          <br />
          Elevate.
        </h1>

        <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-12">
          A complete assessment platform for educators — create exams, auto-grade submissions, and track every student's performance from one elegant dashboard.
        </p>


        {/* Mini dashboard preview */}
        <div className="relative max-w-2xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left shadow-2xl">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="flex-1 bg-slate-800 rounded-md h-5 ml-2" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Assessments", val: "12", color: "text-indigo-400" },
                { label: "Students", val: "248", color: "text-emerald-400" },
                { label: "Avg. Score", val: "76%", color: "text-amber-400" },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-slate-800 rounded-xl p-3 text-center">
                  <p className={`text-xl font-bold ${color}`}>{val}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Fake question rows */}
            <div className="space-y-2">
              {["Data Structures — Final Exam", "React Fundamentals Quiz", "SQL Basics Assessment"].map((title, i) => (
                <div key={title} className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-slate-300 text-xs font-medium">{title}</span>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Live</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating result badge */}
          <div className="absolute -top-4 -right-4 bg-slate-900 border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-xl">
            <p className="text-emerald-400 text-xl font-bold leading-none">94%</p>
            <p className="text-slate-500 text-xs mt-0.5">Top score</p>
          </div>

          {/* Floating graded badge */}
          <div className="absolute -bottom-4 -left-4 bg-slate-900 border border-indigo-500/30 rounded-xl px-3 py-2.5 shadow-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-indigo-300 text-xs font-medium">Auto-graded in 0.3s</span>
          </div>
        </div>
      </div>
    </section>
  );
}


function Stats() {
  return (
    <section className="bg-slate-900 border-y border-slate-800 py-14">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>{value}</p>
              <p className="text-slate-500 text-xs tracking-wide uppercase font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Features() {
  return (
    <section className="bg-slate-950 py-28 relative overflow-hidden" style={bgStyle}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            Platform Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Georgia', serif" }}>
            Everything an educator{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #34d399)" }}>
              actually needs
            </span>
          </h2>
          <p className="text-slate-400 font-light leading-relaxed">
            No bloat, no friction. Built specifically for creating, delivering, and analyzing assessments at any scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, desc, accent }) => (
            <div
              key={title}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${accentColors[accent]}`}>
                {icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Create an Assessment",
      desc: "Add a title, description, and questions. Mix MCQ and text types. Set marks per question.",
      accent: "indigo",
    },
    {
      num: "02",
      title: "Students Take the Exam",
      desc: "One question at a time, with a live navigator panel — familiar to anyone who's taken a competitive exam.",
      accent: "emerald",
    },
    {
      num: "03",
      title: "Results in Seconds",
      desc: "Submissions are graded instantly. Students see their score; admins see everything.",
      accent: "amber",
    },
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800 py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            How It Works
          </div>
          <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>
            From idea to graded exam<br />in three steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-indigo-500/30 via-emerald-500/30 to-amber-500/30" />

          {steps.map(({ num, title, desc, accent }) => (
            <div key={num} className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <div className={`text-4xl font-bold mb-5 ${accentColors[accent].split(" ")[2]}`} style={{ fontFamily: "'Georgia', serif" }}>
                {num}
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
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
    <section className="bg-slate-950 py-28" style={bgStyle}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-14">
          Educator Stories
        </div>

        <div className="min-h-36 mb-8">
          <p
            className="text-2xl md:text-3xl font-light text-white leading-relaxed italic"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            "{t.quote}"
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
            {t.initial}
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">{t.name}</p>
            <p className="text-slate-500 text-xs">{t.role}</p>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-indigo-500" : "w-3 bg-slate-700 hover:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}




export default function Home() {
  return (
    <div className="bg-slate-950">
      <main>
        <Hero />
        <Stats />
        <section id="features"><Features /></section>
        <section id="how-it-works"><HowItWorks /></section>
        <section id="testimonials"><Testimonials /></section>
      </main>
    </div>
  );
}