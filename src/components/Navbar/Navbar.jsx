import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ArrowRight } from 'lucide-react';
import SITE_DATA from '../../data/site';
import MobileMenu from './MobileMenu';
import IlluminateLogo from '../ui/IlluminateLogo';

export const Navbar = ({ onRegisterClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || location.pathname !== '/'
            ? 'py-3 bg-[#070314]/85 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-black/40'
            : 'py-4 sm:py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Group (Logos in Drop-Shadow Box) */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-[#0e0722]/90 backdrop-blur-md border border-purple-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)] transition-all">
            {/* Raghu Engg College Logo */}
            <a
              href="https://raghuenggcollege.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg border border-purple-200/40 shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center justify-center flex-shrink-0"
              title="Raghu Engineering College (Autonomous)"
            >
              <img
                src="/assets/logos/rec-logo.png"
                alt="Raghu Engineering College"
                className="h-5 sm:h-6 w-auto object-contain"
              />
            </a>

            {/* Divider */}
            <span className="text-purple-400/80 font-mono text-xs font-bold select-none">
              ×
            </span>

            {/* E-Cell IIT Bombay Logo */}
            <a
              href="https://www.ecell.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg border border-purple-200/40 shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center justify-center flex-shrink-0"
              title="E-Cell, IIT Bombay"
            >
              <img
                src="/assets/logos/ecell-logo.jpeg"
                alt="E-Cell IIT Bombay"
                className="h-5 sm:h-6 w-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation Links (Floating Glass Pill Bar) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-[#0d0722]/80 border border-purple-500/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <Link
              to="/"
              className={`text-xs font-semibold tracking-wide uppercase px-3.5 py-1.5 rounded-full transition-all relative focus:outline-none ${
                location.pathname === '/'
                  ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/40 shadow-glow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              Home
            </Link>
            {SITE_DATA.navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-xs font-semibold tracking-wide uppercase px-3.5 py-1.5 rounded-full transition-all relative focus:outline-none ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/40 shadow-glow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-slate-200 hover:text-white hover:border-purple-400 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none active:scale-95 transition-all"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-purple-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onRegisterClick={onRegisterClick}
      />
    </>
  );
};

export default Navbar;
