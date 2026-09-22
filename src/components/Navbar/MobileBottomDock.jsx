import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Users, HelpCircle, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const DOCK_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Speakers', href: '/speaker', icon: Users },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'Contact', href: '/contact', icon: Headphones },
];

export const MobileBottomDock = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 left-2.5 right-2.5 z-50 md:hidden max-w-sm mx-auto"
    >
      <div className="rounded-2xl bg-[#09041a]/95 backdrop-blur-2xl border border-purple-500/35 px-1.5 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] shadow-purple-950/50 flex items-center justify-between gap-1 overflow-hidden">
        {DOCK_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl font-bold text-[9px] min-[360px]:text-[10px] tracking-wide uppercase transition-transform duration-150 active:scale-95 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 border border-purple-300/60 shadow-glow-sm'
                    : 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/40 shadow-sm hover:brightness-110'
                }`}
              >
                <Icon className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 mb-0.5 text-amber-300 animate-pulse" />
                <span className="truncate max-w-full">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-colors duration-150 border ${
                isActive
                  ? 'text-purple-200 bg-purple-900/45 border-purple-500/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-purple-950/20'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 mb-0.5 ${isActive ? 'text-purple-300' : 'text-slate-400'}`} />
              <span className={`text-[9px] min-[360px]:text-[10px] font-semibold tracking-tight truncate max-w-full ${isActive ? 'text-white font-bold' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0.5 w-3.5 h-0.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomDock;
