import React from 'react';
import { Particles } from './particles';

/**
 * Ultra-Smooth High Performance Animated Cosmic Background
 * Combines ScrollX UI Interactive 3D Particles with glowing auroras.
 */
export const AnimatedBackground = () => {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#05020c]"
      aria-hidden="true"
    >
      {/* ScrollX UI Interactive 3D Cosmic Theme Particles (High Density & Reactive) */}
      <Particles
        particleCount={14000}
        particleSize={22}
        className="z-0 opacity-95"
      />

      {/* Aurora Orb 1: Upper Violet Aurora (Static GPU float) */}
      <div
        className="absolute -top-32 left-1/4 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] rounded-full bg-gradient-to-br from-purple-700/20 via-violet-600/12 to-transparent blur-[40px] pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Aurora Orb 2: Right Indigo Wave */}
      <div
        className="absolute top-1/3 -right-32 w-[400px] sm:w-[620px] h-[400px] sm:h-[620px] rounded-full bg-gradient-to-tl from-indigo-700/18 via-purple-900/15 to-transparent blur-[40px] pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Aurora Orb 3: Lower Left Amber/Rose Whisper */}
      <div
        className="absolute bottom-1/4 -left-28 w-[350px] sm:w-[520px] h-[350px] sm:h-[520px] rounded-full bg-gradient-to-tr from-amber-500/08 via-purple-600/08 to-transparent blur-[40px] pointer-events-none will-change-transform"
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
