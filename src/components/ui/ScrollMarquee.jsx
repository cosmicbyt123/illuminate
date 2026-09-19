import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const ParallaxText = ({ children, baseVelocity = 100 }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Reverse direction if scrolling up
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap leading-none tracking-[-0.02em] py-4 sm:py-6 relative z-0">
      <motion.div
        className="flex whitespace-nowrap font-extrabold text-5xl sm:text-7xl lg:text-8xl uppercase text-transparent bg-clip-text font-outline-2 drop-shadow-sm opacity-20 will-change-transform"
        style={{ x, WebkitTextStroke: '1.5px rgba(168,85,247,0.3)' }}
      >
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
      </motion.div>
    </div>
  );
};

export const ScrollMarquee = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="w-full relative mt-4 mb-2 bg-transparent border-y border-purple-500/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
      {/* Decorative Glow inside Marquee */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05020c] via-transparent to-[#05020c] z-10 pointer-events-none" />

      {isMobile ? (
        /* Mobile: 100% Hardware-Accelerated CSS Marquee (0% JS/CPU overhead) */
        <div className="overflow-hidden whitespace-nowrap flex leading-none py-3.5 relative z-0">
          <div
            className="flex whitespace-nowrap font-extrabold text-4xl uppercase text-transparent bg-clip-text font-outline-2 opacity-25 animate-marquee-mobile"
            style={{ WebkitTextStroke: '1.5px rgba(168,85,247,0.35)' }}
          >
            <span className="block mr-8">ILLUMINATE 2026 • ENTREPRENEURSHIP • MASTERCLASS • STARTUPS •</span>
            <span className="block mr-8">ILLUMINATE 2026 • ENTREPRENEURSHIP • MASTERCLASS • STARTUPS •</span>
            <span className="block mr-8">ILLUMINATE 2026 • ENTREPRENEURSHIP • MASTERCLASS • STARTUPS •</span>
            <span className="block mr-8">ILLUMINATE 2026 • ENTREPRENEURSHIP • MASTERCLASS • STARTUPS •</span>
          </div>
        </div>
      ) : (
        /* Desktop: 100% Original Framer Motion Spring & Velocity Marquee */
        <ParallaxText baseVelocity={2}>
          ILLUMINATE 2026 • ENTREPRENEURSHIP • MASTERCLASS • STARTUPS •
        </ParallaxText>
      )}

      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-purple-500/5 -z-10" />
    </div>
  );
};

export default ScrollMarquee;
