import React, { useState, useEffect } from 'react';
import { Particles } from './particles';

// Curated 20 twinkling cosmic stars for mobile (Pure GPU CSS, 0% JS/canvas overhead)
const MOBILE_STARS = [
  { top: '6%', left: '18%', size: 2, color: '#c084fc', delay: '0s', dur: '3.2s' },
  { top: '11%', left: '82%', size: 2.5, color: '#ffffff', delay: '1.2s', dur: '4s' },
  { top: '16%', left: '44%', size: 1.5, color: '#a855f7', delay: '0.5s', dur: '2.6s' },
  { top: '22%', left: '90%', size: 3, color: '#38bdf8', delay: '2s', dur: '3.8s' },
  { top: '27%', left: '12%', size: 2, color: '#fbbf24', delay: '0.8s', dur: '3.2s' },
  { top: '34%', left: '65%', size: 2, color: '#ffffff', delay: '1.6s', dur: '4.5s' },
  { top: '41%', left: '24%', size: 2.5, color: '#c084fc', delay: '2.2s', dur: '3.1s' },
  { top: '47%', left: '85%', size: 1.5, color: '#ffffff', delay: '0.3s', dur: '2.8s' },
  { top: '53%', left: '38%', size: 3, color: '#a855f7', delay: '1.8s', dur: '3.9s' },
  { top: '61%', left: '72%', size: 2, color: '#fbbf24', delay: '0.9s', dur: '3.4s' },
  { top: '67%', left: '15%', size: 1.5, color: '#38bdf8', delay: '2.5s', dur: '4.1s' },
  { top: '74%', left: '88%', size: 2.5, color: '#ffffff', delay: '1.1s', dur: '3.6s' },
  { top: '81%', left: '50%', size: 2, color: '#c084fc', delay: '0.7s', dur: '2.9s' },
  { top: '87%', left: '22%', size: 2, color: '#ffffff', delay: '1.9s', dur: '4.3s' },
  { top: '93%', left: '78%', size: 1.5, color: '#a855f7', delay: '0.4s', dur: '3.2s' },
  { top: '14%', left: '94%', size: 2, color: '#ffffff', delay: '2.1s', dur: '3.7s' },
  { top: '30%', left: '32%', size: 1.5, color: '#fbbf24', delay: '1.4s', dur: '3.3s' },
  { top: '50%', left: '10%', size: 2.5, color: '#c084fc', delay: '0.6s', dur: '4.2s' },
  { top: '70%', left: '58%', size: 2, color: '#ffffff', delay: '2.3s', dur: '3.5s' },
  { top: '84%', left: '92%', size: 1.5, color: '#38bdf8', delay: '1.7s', dur: '3s' },
];

/**
 * Ultra-Smooth High Performance Animated Cosmic Background
 * Desktop: Full interactive 3D 14,000 Three.js particles with mouse tracking & Aurora Orbs
 * Mobile: Pure GPU CSS Aurora Mesh & Twinkling Starlight (0% WebGL, 0% JS, Locked 120 FPS)
 */
export const AnimatedBackground = ({ isPaused = false }) => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#05020c]"
      aria-hidden="true"
    >
      {/* Desktop Only: High-density 14,000 3D Three.js Particles */}
      {isDesktop ? (
        <Particles
          particleCount={14000}
          particleSize={22}
          isPaused={isPaused}
          className="z-0 opacity-95"
        />
      ) : (
        /* Mobile Only: Zero-Overhead Hardware-Accelerated Starlight & Aurora Mesh */
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Static Ambient Aurora Gradients - Zero continuous GPU recalculation */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 90% 55% at 50% -5%, rgba(168, 85, 247, 0.22), transparent 70%),
                radial-gradient(ellipse 65% 45% at 90% 35%, rgba(56, 189, 248, 0.12), transparent 60%),
                radial-gradient(ellipse 70% 50% at 10% 65%, rgba(192, 132, 252, 0.15), transparent 65%)
              `
            }}
          />
          {MOBILE_STARS.map((star, i) => (
            <span
              key={i}
              className="absolute rounded-full animate-pulse pointer-events-none will-change-transform"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                boxShadow: `0 0 ${star.size * 2.5}px ${star.color}`,
                animationDelay: star.delay,
                animationDuration: star.dur,
              }}
            />
          ))}
        </div>
      )}

      {/* Desktop Aurora Orbs (Preserved 100% for desktop) */}
      {isDesktop && (
        <>
          {/* Aurora Orb 1: Upper Violet Aurora */}
          <div
            className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-purple-700/20 via-violet-600/12 to-transparent blur-[40px] pointer-events-none will-change-transform"
            style={{ transform: 'translate3d(0,0,0)' }}
          />

          {/* Aurora Orb 2: Right Indigo Wave */}
          <div
            className="absolute top-1/3 -right-32 w-[620px] h-[620px] rounded-full bg-gradient-to-tl from-indigo-700/18 via-purple-900/15 to-transparent blur-[40px] pointer-events-none will-change-transform"
            style={{ transform: 'translate3d(0,0,0)' }}
          />

          {/* Aurora Orb 3: Lower Left Amber/Rose Whisper */}
          <div
            className="absolute bottom-1/4 -left-28 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-amber-500/08 via-purple-600/08 to-transparent blur-[40px] pointer-events-none will-change-transform"
            style={{ transform: 'translate3d(0,0,0)' }}
          />
        </>
      )}

      {/* Cyber Perspective Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #a855f7 1px, transparent 1px),
            linear-gradient(to bottom, #a855f7 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at 50% 40%, black 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 20%, transparent 85%)',
        }}
      />

      {/* Vignette Edge Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05020c]/60 via-transparent to-[#05020c]/80" />
    </div>
  );
};

export default AnimatedBackground;
