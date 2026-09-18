import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * ScrollReveal Component
 * High-performance GPU-accelerated viewport entrance with zero repaint stutter.
 */
export function ScrollReveal({
  children,
  delay = 0,
  distance = 22,
  className = '',
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        bounce: 0.25,
        duration: reduceMotion ? 0 : 0.8,
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
