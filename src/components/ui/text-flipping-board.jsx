"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><";

/**
 * Ultra-Smooth High-Speed Text Scramble / Decryption Component
 *
 * Requirements:
 * - Butter-smooth 60fps/120fps performance with zero React re-render lag.
 * - Starts instantly on mount/refresh.
 * - Rapidly cycles through random glyphs and sequentially locks in letters left-to-right.
 * - Fast and punchy (~680ms total) so users see the decryption sweep clearly without delay.
 */
export function TextFlippingBoard({
  text = "START YOUR\nENTREPRENEURSHIP\nJOURNEY",
  className,
}) {
  const lines = useMemo(() => text.split("\n"), [text]);
  const spanRefs = useRef({});

  useEffect(() => {
    let frameId;
    let tickCount = 0;
    const startTime = performance.now();

    // User requested: Scramble for ~1.3s first, then decrypt fast
    const SCRAMBLE_DELAY_MS = 1300; 
    const CHAR_LOCK_INTERVAL_MS = 16; // Fast decryption cascade

    let cumulativeCharIndex = 0;
    const charLockTimes = {};

    lines.forEach((line, lIdx) => {
      Array.from(line).forEach((char, cIdx) => {
        if (char === " ") return;
        charLockTimes[`${lIdx}-${cIdx}`] =
          SCRAMBLE_DELAY_MS + cumulativeCharIndex * CHAR_LOCK_INTERVAL_MS;
        cumulativeCharIndex++;
      });
    });

    const totalDuration =
      SCRAMBLE_DELAY_MS + cumulativeCharIndex * CHAR_LOCK_INTERVAL_MS + 60;

    const lockedClass =
      "inline-block font-mono text-white font-black drop-shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_24px_rgba(192,132,252,0.5)] transition-colors duration-75";
    const scrambleClass =
      "inline-block font-mono text-purple-300/85 font-bold drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]";

    const tick = (now) => {
      const elapsed = now - startTime;
      tickCount++;

      // Vsync-synchronized glyph churn: updates random characters every 2nd RAF frame (~30-60Hz)
      const shouldShuffle = tickCount % 2 === 0;

      lines.forEach((line, lIdx) => {
        Array.from(line).forEach((targetChar, cIdx) => {
          if (targetChar === " ") return;
          const el = spanRefs.current[`${lIdx}-${cIdx}`];
          if (!el) return;

          const lockTime = charLockTimes[`${lIdx}-${cIdx}`];
          if (elapsed >= lockTime) {
            if (el.textContent !== targetChar) {
              el.textContent = targetChar;
              el.className = lockedClass;
            }
          } else if (shouldShuffle) {
            el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            el.className = scrambleClass;
          }
        });
      });

      if (elapsed < totalDuration) {
        frameId = requestAnimationFrame(tick);
      } else {
        // Final lock-in for all letters
        lines.forEach((line, lIdx) => {
          Array.from(line).forEach((targetChar, cIdx) => {
            if (targetChar === " ") return;
            const el = spanRefs.current[`${lIdx}-${cIdx}`];
            if (el) {
              el.textContent = targetChar;
              el.className = lockedClass;
            }
          });
        });
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [lines]);

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl flex flex-col items-center justify-center select-none py-2 sm:py-4",
        className,
      )}
    >
      {/* Soft Ambient Text Glow Aura */}
      <div
        className="absolute w-[280px] sm:w-[500px] h-[160px] sm:h-[220px] rounded-full bg-purple-600/15 blur-[65px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Pure Floating Scramble Typography (No Boxes, No Terminal) */}
      <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-4 md:gap-5 font-mono text-center w-full">
        {lines.map((line, lineIdx) => {
          const chars = Array.from(line);

          return (
            <div
              key={lineIdx}
              className={cn(
                "flex items-center justify-center flex-nowrap whitespace-nowrap leading-tight w-full",
                lineIdx === 1
                  ? "text-xs min-[360px]:text-sm min-[400px]:text-base sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-[0.06em] min-[360px]:tracking-[0.1em] sm:tracking-[0.18em] md:tracking-[0.22em]"
                  : "text-sm min-[360px]:text-base min-[400px]:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-[0.12em] min-[360px]:tracking-[0.18em] sm:tracking-[0.24em] md:tracking-[0.28em]"
              )}
            >
              {chars.map((char, charIdx) => {
                if (char === " ") {
                  return (
                    <span
                      key={charIdx}
                      className="inline-block w-2 min-[360px]:w-2.5 sm:w-4"
                    >
                      &nbsp;
                    </span>
                  );
                }

                return (
                  <span
                    key={charIdx}
                    ref={(el) => {
                      if (el) spanRefs.current[`${lineIdx}-${charIdx}`] = el;
                    }}
                    className="inline-block font-mono text-purple-300/85 font-bold drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]"
                  >
                    {GLYPHS[Math.floor(Math.random() * GLYPHS.length)]}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TextFlippingBoard;

