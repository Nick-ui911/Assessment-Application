import React from "react";

export default function Footer() {
  const links = ["Home", "Projects", "Settings"];
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-purple-500/15 mt-auto"
      style={{
        background: "rgba(21, 0, 48, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(192,132,252,0.5) 30%, rgba(147,51,234,0.8) 50%, rgba(192,132,252,0.5) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_4px_16px_rgba(147,51,234,0.45)]">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5z" />
                </svg>
              </div>
              <span
                className="text-xl font-bold text-white tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Aura<span className="text-purple-400">X</span>
              </span>
            </div>

            <p className="text-sm text-purple-200/60 leading-relaxed max-w-xs">
              Crafted with precision and elegance. Building modern digital
              experiences with a refined violet aesthetic.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase()}`}
                    className="text-sm text-purple-200/60 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">
              Connect
            </h3>

            <div className="flex gap-3">
              {["Twitter", "GitHub", "LinkedIn"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-4 py-2 rounded-xl text-xs font-medium text-purple-200/70 bg-purple-500/5 border border-purple-500/15 hover:text-white hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 mb-6 h-px bg-purple-500/15" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/50">
          <p>© {year} AuraX. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>
    </footer>
  );
}