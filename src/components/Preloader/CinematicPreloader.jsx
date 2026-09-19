import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TextFlippingBoard } from '@/components/ui/text-flipping-board';

const INTRO_COPY = "START YOUR\nENTREPRENEURSHIP\nJOURNEY";

/**
 * Cinematic "Door of Light" Preloader
 *
 * Exact composition matching user reference:
 * - Glowing white vertical door capsule with light stem & purple radial aura
 * - E-CELL • RAGHU ENGINEERING COLLEGE amber-dot pill badge
 * - The Terminal Board with "2 up, 2 down" wave animation (no matrix grid boxes)
 * - START TO BEGIN → button with soft glow
 * - Entering door animation: door expands smoothly, flooding the screen with light into the site.
 */
export const CinematicPreloader = ({ onComplete }) => {
  const [isEntering, setIsEntering] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      onComplete?.();
    }
  }, [reduceMotion, onComplete]);

  const handleEnter = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (isEntering) return;
    setIsEntering(true);

    // Duration of the zoom through the door: exact 850ms matching original
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 850);

    return () => {
      clearTimeout(completeTimer);
    };
  };

  const handleSkip = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    onComplete?.();
  };

  return (
    <motion.div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none bg-[#05020c] ${
        isEntering ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Floating Background Stars / Stardust */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <span className="absolute top-[14%] left-[45%] w-1.5 h-1.5 rounded-full bg-purple-200/80 animate-pulse" />
        <span className="absolute top-[30%] left-[24%] w-1 h-1 rounded-full bg-purple-300/60" />
        <span className="absolute top-[68%] left-[18%] w-1 h-1 rounded-full bg-purple-400/70 animate-pulse" style={{ animationDuration: '4s' }} />
        <span className="absolute top-[52%] right-[15%] w-1.5 h-1.5 rounded-full bg-amber-200/60 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <span className="absolute top-[26%] right-[22%] w-1 h-1 rounded-full bg-purple-200/60" />
        <span className="absolute bottom-[20%] right-[35%] w-1 h-1 rounded-full bg-slate-400/50" />
      </div>

      {/* Ambient Radial Violet Glow */}
      <div
        className="absolute w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full bg-gradient-to-tr from-purple-700/25 via-violet-500/20 to-transparent blur-[85px] pointer-events-none z-0"
      />

      {/* Top Right Glass Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        className={`absolute top-4 right-4 sm:top-7 sm:right-8 z-50 text-[10px] sm:text-xs font-mono tracking-widest text-purple-300/75 hover:text-white transition-all py-1.5 px-3 sm:px-3.5 rounded-full bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/50 backdrop-blur-md cursor-pointer ${
          isEntering ? 'opacity-0' : 'opacity-100'
        }`}
      >
        SKIP &rarr;
      </button>

      {/* PHASE 1: Terminal Intro Content Stack (Fades out when user clicks enter) */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center w-full max-w-3xl px-2.5 sm:px-6 py-6 text-center my-auto"
        animate={
          isEntering
            ? { opacity: 0, scale: 1.05, y: 15 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: 0.3 }}
      >
        {/* 1. Institution & Event Pill Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-950/70 border border-purple-500/35 text-purple-200 text-[9px] min-[380px]:text-[10px] sm:text-xs font-mono tracking-wider sm:tracking-[0.2em] uppercase whitespace-nowrap shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-md mb-4 sm:mb-6 max-w-[92vw]">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-bold text-slate-100">E-CELL</span>
          <span className="text-purple-400/60">&bull;</span>
          <span className="text-purple-200">RAGHU ENGINEERING COLLEGE</span>
        </div>

        {/* 2. Floating "2 Up, 2 Down" Wave Typography (Pure Floating Text, No Terminal UI) */}
        <div className="w-full max-w-3xl px-2 mb-6 sm:mb-9">
          <TextFlippingBoard text={INTRO_COPY} />
        </div>

        {/* 3. Action CTA Button (Triggers entry & gate reveal) */}
        <div>
          <button
            type="button"
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-7 sm:px-10 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase text-slate-950 bg-gradient-to-r from-purple-100 via-white to-purple-200 hover:from-white hover:to-white shadow-[0_0_25px_rgba(192,132,252,0.4),0_0_50px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer pointer-events-auto"
          >
            <span className="font-extrabold tracking-widest">Start to Begin</span>
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-950 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* PHASE 2: Glowing Gate of Light - Appears at center on enter, zooms with exact original speed */}
      {isEntering && (
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-4"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            scale: [1, 5, 25],
            opacity: [1, 1, 1],
          }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {/* Volumetric Purple Ambient Bloom */}
          <div className="absolute w-[340px] sm:w-[500px] h-[500px] sm:h-[640px] rounded-full bg-gradient-to-tr from-purple-700/20 via-violet-500/25 to-transparent blur-[85px] pointer-events-none" />

          {/* Vertical Glowing Gate Capsule (Clean rounded capsule, no tail) */}
          <div className="relative w-16 sm:w-20 md:w-24 h-64 sm:h-80 md:h-[400px] rounded-[9999px] bg-white shadow-[0_0_40px_#ffffff,0_0_80px_#c084fc] flex items-center justify-center overflow-hidden">
            {/* Intense inner core */}
            <div className="w-1/2 h-full bg-white shadow-[0_0_20px_#ffffff] z-10" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CinematicPreloader;
