import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import SITE_DATA from '../../data/site';
import EVENT_DATA from '../../data/event';
import IlluminateLogo from '../ui/IlluminateLogo';

export const MobileMenu = ({ isOpen, onClose, onRegisterClick }) => {
  const location = useLocation();

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
      <div className="relative z-10 flex flex-col h-full bg-[#080417] border-l border-purple-500/20 p-6 overflow-y-auto w-4/5 ml-auto">
        {/* Header with Plain Logo & Close */}
        <div className="flex items-center justify-between pb-6 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-purple-300 font-semibold uppercase tracking-wider">
              REC × IITB
            </span>
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
          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-all min-h-[48px] ${location.pathname === '/' ? 'text-white bg-purple-900/40 border border-purple-500/30' : 'text-slate-200 hover:text-white hover:bg-purple-900/30 border border-transparent'}`}
          >
            <span>Home</span>
            <ArrowRight className="w-4 h-4 text-purple-400 opacity-60" />
          </Link>
          {SITE_DATA.navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-all min-h-[48px] ${location.pathname === link.href ? 'text-white bg-purple-900/40 border border-purple-500/30' : 'text-slate-200 hover:text-white hover:bg-purple-900/30 border border-transparent hover:border-purple-500/20'}`}
            >
              <span>{link.label}</span>
              <ArrowRight className="w-4 h-4 text-purple-400 opacity-60" />
            </Link>
          ))}
        </nav>

        {/* Institution Links */}
        <div className="pt-6 border-t border-purple-900/40 space-y-4">

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
