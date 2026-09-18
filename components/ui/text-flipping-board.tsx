"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><";

export function TextFlippingBoard({
  text = "START YOUR\nENTREPRENEURSHIP\nJOURNEY",
  className,
}: {
  text?: string;
  className?: string;
}) {
  const lines = useMemo(() => text.split("\n"), [text]);
  const spanRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    let frameId: number;
    let lastShuffle = 0;
    const SHUFFLE_INTERVAL_MS = 28;
    const startTime = performance.now();

    const totalCharsLine2 = lines[2]?.length || 7;

    const getLockTime = (lineIdx: number, charIdx: number) => {
      if (lineIdx === 0) return 70 + charIdx * 18;
      if (lineIdx === 1) return 240 + charIdx * 18;
      if (lineIdx === 2) return 520 + charIdx * 20;
      return 680;
    };

    const totalDuration = 520 + totalCharsLine2 * 20 + 80;

    const lockedClass =
      "inline-block font-mono text-white font-black drop-shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_24px_rgba(192,132,252,0.5)] transition-colors duration-100";
    const scrambleClass =
      "inline-block font-mono text-purple-300/85 font-bold drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]";

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const shouldShuffle = now - lastShuffle > SHUFFLE_INTERVAL_MS;

      if (shouldShuffle || elapsed >= totalDuration) {
        if (shouldShuffle) lastShuffle = now;

        lines.forEach((line, lIdx) => {
          Array.from(line).forEach((targetChar, cIdx) => {
            if (targetChar === " ") return;
            const el = spanRefs.current[`${lIdx}-${cIdx}`];
            if (!el) return;

            const lockTime = getLockTime(lIdx, cIdx);
            if (elapsed >= lockTime) {
              if (el.textContent !== targetChar) {
                el.textContent = targetChar;
                el.className = lockedClass;
              }
            } else {
              el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              el.className = scrambleClass;
            }
          });
        });
      }

      if (elapsed < totalDuration) {
        frameId = requestAnimationFrame(tick);
      } else {
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
      <div
        className="absolute w-[280px] sm:w-[500px] h-[160px] sm:h-[220px] rounded-full bg-purple-600/15 blur-[65px] pointer-events-none -z-10"
        aria-hidden="true"
      />

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
