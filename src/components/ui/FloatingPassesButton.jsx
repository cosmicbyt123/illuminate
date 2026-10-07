import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Floating "PASSES" Side Tab
 * Matches the official orange-bordered ticket badge design.
 * Positioned on the screen edge to provide 1-click instant access to ticket booking.
 */
export const FloatingPassesButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname !== '/register') {
      navigate('/register');
    }
    // Smooth scroll to the registration wizard
    setTimeout(() => {
      const el = document.getElementById('register');
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 80);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Book Event Passes"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 group flex flex-col items-center justify-center gap-2.5 px-2.5 py-4 bg-gradient-to-b from-[#1c1c1f] via-[#141416] to-[#0b0b0d] border-2 border-r-0 border-orange-500 hover:border-orange-400 rounded-l-2xl shadow-[0_0_22px_rgba(249,115,22,0.35)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] transition-all duration-300 hover:-translate-x-1.5 focus:outline-none"
    >
      {/* Ticket Icon (Matches screenshot cutout shape with dual vertical bars) */}
      <div className="text-white group-hover:scale-110 transition-transform duration-300">
        <svg
          className="w-5 h-5 text-white fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="6" width="18" height="12" rx="2.5" />
          <path d="M3 11a2 2 0 0 1 0 2" />
          <path d="M21 11a2 2 0 0 0 0 2" />
          <line x1="10" y1="9" x2="10" y2="15" />
          <line x1="14" y1="9" x2="14" y2="15" />
        </svg>
      </div>

      {/* PASSES Text (Vertical uppercase as shown in the screenshot) */}
      <span
        className="font-extrabold text-[11px] sm:text-xs text-white tracking-[0.2em] uppercase select-none group-hover:text-orange-300 transition-colors"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
      >
        PASSES
      </span>

      {/* Subtle pulse indicator on hover */}
      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:animate-ping" />
    </button>
  );
};

export default FloatingPassesButton;
