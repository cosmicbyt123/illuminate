import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import EVENT_DATA from '../../data/event';
import BackgroundGlow from './BackgroundGlow';
import IlluminateLogo from '../ui/IlluminateLogo';

const heroVariants = {
  offscreen: {
    y: 100,
    opacity: 0,
    rotate: 2,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1.2,
    },
  },
};

const textVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 1,
    },
  },
};

const containerVariants = {
  offscreen: {},
  onscreen: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4, // Faster delay
    }
  }
};

export const Hero = ({ onRegisterClick, isReady = true }) => {
  return (
    <section
      id="hero"
      className="relative pt-3 sm:pt-8 pb-6 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden"
    >
      <BackgroundGlow />

      <motion.div 
        className="relative z-10 w-full flex flex-col items-center"
        initial="offscreen"
        animate={isReady ? "onscreen" : "offscreen"}
        variants={containerVariants}
      >
        {/* Floating Pill Badge */}
        <motion.div 
          variants={textVariants}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full glass-panel border-purple-500/40 text-[10px] sm:text-xs text-purple-300 mb-5 sm:mb-8 max-w-[92vw] overflow-hidden shadow-sm"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
          <span className="text-slate-200 font-medium tracking-wide">
            {EVENT_DATA.badge}
          </span>
        </motion.div>

        {/* Spring-Animated Logo (Centerpiece Headline) */}
        <motion.div 
          variants={heroVariants}
          className="relative z-10 mb-6 sm:mb-12 w-full max-w-5xl px-2 sm:px-4 flex justify-center"
        >
          <img 
            src="/assets/logos/illuminate-hero-logo.png" 
            alt="Illuminate 2026 - Empowering the next generation of Changemakers" 
            className="w-auto h-28 sm:h-44 md:h-56 lg:h-64 xl:h-72 max-w-[88vw] object-contain drop-shadow-[0_0_45px_rgba(168,85,247,0.45)] contrast-[1.06] brightness-[1.02] select-none transition-transform duration-300 hover:scale-[1.02]"
          />
          <h1 className="sr-only">Illuminate 2026 - Empowering The Next Generation of Changemakers</h1>
        </motion.div>

        {/* Subtitle / Description */}
        <motion.p 
          variants={textVariants}
          className="relative z-10 text-xs sm:text-base md:text-xl text-slate-300 max-w-3xl leading-relaxed mb-6 sm:mb-10 px-2 sm:px-2 font-normal text-center w-full break-words"
        >
          Organized by the{' '}
          <span className="text-white font-semibold">
            {EVENT_DATA.organizer.name} at {EVENT_DATA.organizer.college}
          </span>{' '}
          in academic association with{' '}
          <span className="text-purple-300 font-semibold">
            {EVENT_DATA.organizer.partner}
          </span>
          . Experience an intensive 2-day masterclass on disruptive ideation, lean business architecture, startup finance, and live venture pitching.
        </motion.p>

        {/* Logistics Card Pill (Venue & Schedule) */}
        <motion.div 
          variants={textVariants}
          className="relative z-10 glass-panel rounded-2xl p-4 sm:p-5 max-w-2xl w-full border-purple-500/30 mb-8 sm:mb-10 shadow-glow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-purple-800/40 text-left">
            {/* Venue */}
            <div className="flex items-start gap-3 sm:pt-0">
              <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-300 flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-purple-300 font-semibold">
                  Venue
                </p>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                  {EVENT_DATA.venue.name}
                </p>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-start gap-3 pt-3 sm:pt-0 sm:pl-4">
              <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-300 flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-purple-300 font-semibold">
                  Schedule
                </p>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                  {EVENT_DATA.dates.display}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div 
          variants={textVariants}
          className="relative z-10 flex flex-col xs:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md"
        >
          {/* Primary CTA */}
          <Link
            to="/about"
            className="w-full xs:w-auto min-h-[52px] px-8 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-glow-sm hover:shadow-glow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <span>Explore Event</span>
            <ChevronDown className="w-4 h-4" />
          </Link>

          {/* Secondary CTA */}
          <Link
            to="/contact"
            className="w-full xs:w-auto min-h-[52px] px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-300 hover:text-white bg-[#0c0721]/80 hover:bg-[#150e38] border border-purple-500/30 hover:border-purple-400/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Contact Desk</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
