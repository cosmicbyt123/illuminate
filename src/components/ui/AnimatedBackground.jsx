import React, { useState, useEffect } from 'react';
import { Particles } from './particles';

/**
 * Ultra-Smooth High Performance Animated Cosmic Background
 * Desktop: Full interactive 3D 14,000 Three.js particles with mouse tracking
 * Mobile: Hardware-accelerated Cosmic Aurora Nebula (Zero JS overhead, locked 120 FPS)
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
      {isDesktop && (
        <Particles
          particleCount={14000}
          particleSize={22}
          isPaused={isPaused}
          className="z-0 opacity-95"
        />
      )}

      {/* Mobile Only: Electric Cyber Lighting Beams & Core Glow (0% JS, Pure 120 FPS GPU) */}
      {!isDesktop && (
        <>
          {/* Sweeping Electric Cyber Beam 1 */}
          <div
            className="absolute -top-20 -left-12 w-28 h-[130vh] bg-gradient-to-b from-transparent via-purple-500/20 via-cyan-400/15 to-transparent blur-2xl animate-beam-slow pointer-events-none will-change-transform"
            style={{ transform: 'translate3d(0,0,0)' }}
          />

          {/* Sweeping Electric Cyber Beam 2 */}
          <div
            className="absolute -top-10 -right-12 w-24 h-[130vh] bg-gradient-to-b from-transparent via-violet-500/18 via-pink-500/10 to-transparent blur-2xl animate-beam-reverse pointer-events-none will-change-transform"
            style={{ transform: 'translate3d(0,0,0)' }}
          />

          {/* Central Breathing Electric Spotlight */}
          <div
            className="absolute top-1/4 left-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-purple-600/25 via-cyan-500/12 to-pink-500/15 blur-3xl animate-electric-pulse pointer-events-none will-change-transform"
            style={{ transform: 'translate3d(-50%, 0, 0)' }}
          />
        </>
      )}

      {/* Aurora Orb 1: Upper Violet Aurora (Hardware accelerated float) */}
      <div
        className="absolute -top-32 left-1/4 w-[320px] sm:w-[700px] h-[320px] sm:h-[700px] rounded-full bg-gradient-to-br from-purple-700/20 via-violet-600/12 to-transparent blur-[25px] sm:blur-[40px] pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Aurora Orb 2: Right Indigo Wave */}
      <div
        className="absolute top-1/3 -right-32 w-[300px] sm:w-[620px] h-[300px] sm:h-[620px] rounded-full bg-gradient-to-tl from-indigo-700/18 via-purple-900/15 to-transparent blur-[25px] sm:blur-[40px] pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Aurora Orb 3: Lower Left Amber/Rose Whisper */}
      <div
        className="absolute bottom-1/4 -left-28 w-[260px] sm:w-[520px] h-[260px] sm:h-[520px] rounded-full bg-gradient-to-tr from-amber-500/08 via-purple-600/08 to-transparent blur-[25px] sm:blur-[40px] pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

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
