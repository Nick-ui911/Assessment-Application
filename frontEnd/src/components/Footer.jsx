import React from "react";

export default function Footer() {
  const links = ["Home", "Projects", "Settings"];
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-800 mt-auto bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">Assessment Builder</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              A complete platform for educators — create exams, auto-grade submissions, and track every student's performance.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Navigation</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase()}`}
                    className="text-sm text-slate-500 hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Connect</h3>
            <div className="flex flex-wrap gap-2">
              {["Twitter", "GitHub", "LinkedIn"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 bg-slate-800 border border-slate-700 hover:text-white hover:border-slate-600 hover:bg-slate-700 transition-all duration-150"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 mb-6 h-px bg-slate-800" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© {year} Assessment Builder. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}