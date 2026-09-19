import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * ScrollReveal Component
 * Desktop: GPU-accelerated viewport spring entrance.
 * Mobile: Instant zero-overhead rendering to eliminate navigation lag and jitter on phone.
 */
export function ScrollReveal({
  children,
  delay = 0,
  distance = 22,
  className = '',
}) {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile || reduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        bounce: 0.25,
        duration: 0.8,
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
