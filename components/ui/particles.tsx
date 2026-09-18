"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface ParticlesProps {
  className?: string;
  quantity?: number;
  particleCount?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  particleSize?: number;
  refresh?: boolean;
  color?: string;
  colors?: string[];
  animate?: boolean;
  vx?: number;
  vy?: number;
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
  rgb: number[];
}

export function Particles({
  className = "",
  quantity = 120,
  particleCount,
  staticity = 40,
  ease = 50,
  size = 1.2,
  particleSize,
  refresh = false,
  color = "#a855f7",
  colors = ["#ffffff", "#c084fc", "#a855f7", "#38bdf8", "#fbbf24"],
  animate = true,
  vx = 0,
  vy = 0,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const rafId = useRef<number | null>(null);

  const rawCount = particleCount !== undefined ? particleCount : quantity;
  const count = animate ? Math.min(rawCount, 250) : Math.min(rawCount, 5000);
  const effectiveSize = particleSize !== undefined ? particleSize : size;

  const hexToRgb = (hex: string): number[] => {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((char) => char + char).join("");
    }
    if (cleanHex.length !== 6) {
      return [168, 85, 247];
    }
    const num = parseInt(cleanHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const parsedColors = (colors && colors.length > 0 ? colors : [color]).map(hexToRgb);

  const circleParams = useCallback((): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + effectiveSize;
    const alpha = parseFloat((Math.random() * 0.6 + 0.15).toFixed(2));
    const targetAlpha = parseFloat((Math.random() * 0.7 + 0.2).toFixed(2));
    const dx = (Math.random() - 0.5) * 0.2 + vx;
    const dy = (Math.random() - 0.5) * 0.2 + vy;
    const magnetism = 0.1 + Math.random() * 3;
    const rgb = parsedColors[Math.floor(Math.random() * parsedColors.length)];

    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      rgb,
    };
  }, [effectiveSize, vx, vy, parsedColors]);

  const drawCircle = useCallback((circle: Circle, update = false) => {
    if (!context.current) return;
    const { x, y, translateX, translateY, size: pSize, alpha, rgb } = circle;
    context.current.translate(translateX, translateY);
    context.current.beginPath();
    context.current.arc(x, y, pSize, 0, 2 * Math.PI);
    context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
    context.current.fill();
    context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!update) {
      circles.current.push(circle);
    }
  }, [dpr]);

  const resizeCanvas = useCallback(() => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current = [];
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);

      for (let i = 0; i < count; i++) {
        const circle = circleParams();
        drawCircle(circle);
      }
    }
  }, [circleParams, count, dpr, drawCircle]);

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = useCallback(() => {
    clearContext();
    for (let i = 0; i < circles.current.length; i++) {
      const circle = circles.current[i];
      if (circle.x < -circle.size) circle.x = canvasSize.current.w + circle.size;
      else if (circle.x > canvasSize.current.w + circle.size) circle.x = -circle.size;

      if (circle.y < -circle.size) circle.y = canvasSize.current.h + circle.size;
      else if (circle.y > canvasSize.current.h + circle.size) circle.y = -circle.size;

      circle.x += circle.dx;
      circle.y += circle.dy;

      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      circle.alpha += (circle.targetAlpha - circle.alpha) * 0.02;
      if (Math.abs(circle.targetAlpha - circle.alpha) < 0.05) {
        circle.targetAlpha = parseFloat((Math.random() * 0.7 + 0.15).toFixed(2));
      }

      drawCircle(circle, true);
    }
  }, [drawCircle, ease, staticity]);

  useEffect(() => {
    if (!animate) return;
    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed) return;
      drawParticles();
      rafId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isSubscribed = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [animate, drawParticles]);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    resizeCanvas();

    const onResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [resizeCanvas, refresh]);

  return (
    <div
      ref={canvasContainerRef}
      className={cn("pointer-events-none overflow-hidden", className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export default Particles;
