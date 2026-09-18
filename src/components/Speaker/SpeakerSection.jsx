import React from 'react';
import { User, Sparkles } from 'lucide-react';

export const SpeakerSection = () => {
  return (
    <section id="speaker" className="relative py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full flex-1">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-glow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Keynote Lineup</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
          Speakers
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 uppercase tracking-widest font-mono">
          Announcing Soon • Stay Tuned
        </p>
      </div>

      {/* 2 Empty Square Boxes for 2 Speakers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-3xl mx-auto">
        
        {/* Square Box 1 */}
        <div className="aspect-square w-full max-w-[320px] sm:max-w-[360px] mx-auto rounded-3xl bg-gradient-to-b from-[#160938] to-[#0a031c] border-2 border-purple-500/60 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:border-purple-400 hover:shadow-[0_0_55px_rgba(168,85,247,0.55)] transition-all duration-300">
          
          {/* Ambient Colorful Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-600/20 to-amber-500/10 pointer-events-none" />

          {/* Image Tag Ready for Speaker 1 */}
          <img
            src=""
            alt="Speaker 1"
            id="speaker-1-img"
            className="hidden w-full h-full object-cover rounded-2xl absolute inset-0 z-10"
          />

          {/* Colored Graphic Area & Stay Tuned */}
          <div className="relative z-0 flex flex-col items-center justify-center">
            {/* Colorful Avatar Circle with Glow */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-purple-600/40 via-pink-600/30 to-indigo-600/40 border-2 border-purple-400/50 flex items-center justify-center text-purple-200 mb-6 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <User className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
            </div>

            {/* Bold Colored "STAY TUNED" */}
            <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-950/90 via-pink-950/90 to-purple-950/90 border-2 border-purple-400/60 shadow-[0_0_20px_rgba(217,70,239,0.35)]">
              <span className="text-xl sm:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]">
                STAY TUNED
              </span>
            </div>

            <p className="text-xs text-purple-300/90 font-mono uppercase tracking-widest mt-3">
              Announcing Soon
            </p>
          </div>
        </div>

        {/* Square Box 2 */}
        <div className="aspect-square w-full max-w-[320px] sm:max-w-[360px] mx-auto rounded-3xl bg-gradient-to-b from-[#160938] to-[#0a031c] border-2 border-purple-500/60 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:border-purple-400 hover:shadow-[0_0_55px_rgba(168,85,247,0.55)] transition-all duration-300">
          
          {/* Ambient Colorful Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-600/20 to-amber-500/10 pointer-events-none" />

          {/* Image Tag Ready for Speaker 2 */}
          <img
            src=""
            alt="Speaker 2"
            id="speaker-2-img"
            className="hidden w-full h-full object-cover rounded-2xl absolute inset-0 z-10"
          />

          {/* Colored Graphic Area & Stay Tuned */}
          <div className="relative z-0 flex flex-col items-center justify-center">
            {/* Colorful Avatar Circle with Glow */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-purple-600/40 via-pink-600/30 to-indigo-600/40 border-2 border-purple-400/50 flex items-center justify-center text-purple-200 mb-6 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <User className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
            </div>

            {/* Bold Colored "STAY TUNED" */}
            <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-950/90 via-pink-950/90 to-purple-950/90 border-2 border-purple-400/60 shadow-[0_0_20px_rgba(217,70,239,0.35)]">
              <span className="text-xl sm:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]">
                STAY TUNED
              </span>
            </div>

            <p className="text-xs text-purple-300/90 font-mono uppercase tracking-widest mt-3">
              Announcing Soon
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SpeakerSection;
