import React, { useEffect } from 'react';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import SITE_DATA from '../../data/site';
import EVENT_DATA from '../../data/event';

export const MobileMenu = ({ isOpen, onClose, onRegisterClick }) => {
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = (href) => {
    onClose();
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex flex-col justify-between"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative z-10 flex flex-col h-full bg-[#080417] border-l border-purple-500/20 p-6 overflow-y-auto">
        {/* Header with Logos Drop Shadow Box & Close */}
        <div className="flex items-center justify-between pb-6 border-b border-purple-900/40">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e0722]/90 border border-purple-500/30 shadow-md shadow-black/50">
            <img
              src="/assets/logos/rec-logo.png"
              alt="REC"
              className="h-5 w-auto object-contain bg-white px-1.5 py-0.5 rounded"
            />
            <span className="text-purple-400/80 font-mono text-xs font-bold">×</span>
            <img
              src="/assets/logos/ecell-logo.jpeg"
              alt="E-Cell IITB"
              className="h-5 w-auto object-contain bg-white px-1.5 py-0.5 rounded"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-slate-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-8 flex flex-col gap-2">
          {SITE_DATA.navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold text-slate-200 hover:text-white hover:bg-purple-900/30 border border-transparent hover:border-purple-500/20 transition-all min-h-[48px]"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-4 h-4 text-purple-400 opacity-60" />
            </a>
          ))}
        </nav>

        {/* Institution Links & Register CTA */}
        <div className="pt-6 border-t border-purple-900/40 space-y-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onRegisterClick) {
                onRegisterClick();
              } else {
                handleNavClick('#register');
              }
            }}
            className="w-full min-h-[50px] px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-sm flex items-center justify-center gap-2"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-1">
            <a
              href="https://raghuenggcollege.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Raghu Engg College</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.ecell.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>E-Cell IIT Bombay</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
