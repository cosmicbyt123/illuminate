"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Curated Illuminate Cosmic Palette: Glowing Purple, Violet, Cyan, Amber, and Starlight White
const THEME_PALETTE = [
  new THREE.Color("#c084fc"), // Electric purple
  new THREE.Color("#a855f7"), // Vibrant violet
  new THREE.Color("#9333ea"), // Deep purple
  new THREE.Color("#818cf8"), // Cyber indigo
  new THREE.Color("#38bdf8"), // Electric cyan
  new THREE.Color("#fbbf24"), // Warm amber star
  new THREE.Color("#fef08a"), // Soft gold
  new THREE.Color("#ffffff"), // Pure white starlight
  new THREE.Color("#e9d5ff"), // Lavender glow
  new THREE.Color("#ffffff"), // Starlight
];

/**
 * ScrollX UI Particles Component - Ultra-Reactive Cosmic Theme Edition
 * Dynamic 3D particle system built with Three.js with deep mouse & touch responsive movement,
 * high-density starfield, 3D camera warp/tilt, and cosmic space drift.
 */
export function Particles({
  color,
  particleCount = 12000,
  particleSize = 20,
  animate = true,
  isPaused = false,
  className = "",
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    let camera;
    let scene;
    let material;
    let particles;
    let animationFrameId;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let driftY = 0;
    let driftX = 0;
    let renderer;
    let isTabVisible = typeof document !== "undefined" ? !document.hidden : true;

    // Mobile: clean, crisp, ultra-efficient 500 stars. Desktop: full 12,000–14,000 stars.
    const effectiveCount = isMobile ? Math.min(particleCount, 520) : particleCount;
    const effectiveSize = isMobile ? Math.min(particleSize, 14) : particleSize;

    // Generate circular particle texture with soft glowing aura (smaller texture for mobile)
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      const dim = isMobile ? 64 : 128;
      const half = dim / 2;
      canvas.width = dim;
      canvas.height = dim;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
      grad.addColorStop(0.45, "rgba(255, 255, 255, 0.45)");
      grad.addColorStop(0.75, "rgba(255, 255, 255, 0.1)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(half, half, half, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    };

    const init = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      camera = new THREE.PerspectiveCamera(60, width / height, 2, 3500);
      camera.position.z = 1000;

      scene = new THREE.Scene();

      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const colors = [];

      const singleColor = color ? new THREE.Color(color) : null;

      for (let i = 0; i < effectiveCount; i++) {
        // Broad 3D volume distribution
        vertices.push(
          (Math.random() - 0.5) * 3200,
          (Math.random() - 0.5) * 3200,
          (Math.random() - 0.5) * 2600
        );

        // Assign curated theme colors
        const c = singleColor || THEME_PALETTE[Math.floor(Math.random() * THEME_PALETTE.length)];
        colors.push(c.r, c.g, c.b);
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );

      const sprite = createCircleTexture();
      material = new THREE.PointsMaterial({
        size: effectiveSize,
        sizeAttenuation: true,
        map: sprite,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending, // Radiant cosmic glow over dark background
        depthWrite: false,
        opacity: isMobile ? 0.85 : 0.9,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile, // Desktop keeps antialias; mobile saves critical GPU fillrate
        alpha: true,
        powerPreference: isMobile ? "default" : "high-performance",
        precision: isMobile ? "mediump" : "highp",
      });
      // Desktop keeps full pixel ratio; mobile capped at 1.0 for buttery 60fps
      renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      return renderer;
    };

    const handleResize = () => {
      if (!camera || !renderer || !container) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Desktop only: highly responsive pointer interaction with 3D parallax
    const handlePointerMove = (event) => {
      targetMouseX = (event.clientX - window.innerWidth / 2) * 1.65;
      targetMouseY = (event.clientY - window.innerHeight / 2) * 1.65;
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };

    const animateScene = () => {
      if (!camera || !scene || !renderer || !material || !particles) return;

      if (!isPaused && isTabVisible) {
        if (!isMobile) {
          // Desktop: Ultra-smooth spring-damped tracking & cursor-guided 3D perspective
          mouseX += (targetMouseX - mouseX) * 0.065;
          mouseY += (targetMouseY - mouseY) * 0.065;

          camera.position.x = mouseX * 0.75;
          camera.position.y = -mouseY * 0.75;

          const mouseSpeed = Math.hypot(targetMouseX - mouseX, targetMouseY - mouseY);
          camera.position.z = 1000 - Math.min(mouseSpeed * 0.18, 160);
          camera.lookAt(scene.position);

          driftY += 0.0004;
          driftX += 0.0002;
          particles.rotation.y = driftY + mouseX * 0.00065;
          particles.rotation.x = driftX - mouseY * 0.00065;
        } else {
          // Mobile: Pure, lightweight cosmic drift with zero camera fighting native scroll
          driftY += 0.0003;
          driftX += 0.00015;
          particles.rotation.y = driftY;
          particles.rotation.x = driftX;
        }

        renderer.render(scene, camera);
      }

      animationFrameId = requestAnimationFrame(animateScene);
    };

    renderer = init();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Only attach mousemove on desktop / fine pointer devices (never on mobile touch)
    if (!isMobile && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", handlePointerMove, { passive: true });
    }

    animateScene();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (!isMobile) {
        window.removeEventListener("mousemove", handlePointerMove);
      }
      cancelAnimationFrame(animationFrameId);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      if (material) material.dispose();
    };
  }, [color, particleCount, particleSize, animate, isPaused]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}

export default Particles;
