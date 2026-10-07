/**
 * Centralized environment configuration
 * The Google Apps Script URL is read from environment variables
 * with active fallback to guarantee reliable transmission.
 */

export const CONFIG = {
  GOOGLE_SCRIPT_URL:
    (import.meta.env.VITE_GOOGLE_SCRIPT_URL && import.meta.env.VITE_GOOGLE_SCRIPT_URL.trim()) ||
    'https://script.google.com/macros/s/AKfycbwpaJnFfKXEfAKVrciD4L8EVypwFS881vECSjUKB3lj2kaf7No66dEgQ-bSqoy8Ovbs/exec',
  IS_PROD: import.meta.env.PROD,
  IS_DEV: import.meta.env.DEV,
};

export default CONFIG;
