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
  className = "",
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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

    // Generate high-resolution circular particle texture with soft glowing aura
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
      grad.addColorStop(0.45, "rgba(255, 255, 255, 0.45)");
      grad.addColorStop(0.75, "rgba(255, 255, 255, 0.1)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 64, 0, Math.PI * 2);
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

      for (let i = 0; i < particleCount; i++) {
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
        size: particleSize,
        sizeAttenuation: true,
        map: sprite,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending, // Radiant cosmic glow over dark background
        depthWrite: false,
        opacity: 0.9,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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

    // Highly responsive pointer & touch interaction
    const handlePointerMove = (event) => {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      // High-sensitivity multiplier for dramatic reactive 3D parallax
      targetMouseX = (clientX - window.innerWidth / 2) * 1.65;
      targetMouseY = (clientY - window.innerHeight / 2) * 1.65;
    };

    const animateScene = () => {
      if (!camera || !scene || !renderer || !material || !particles) return;

      // Ultra-smooth spring-damped tracking
      mouseX += (targetMouseX - mouseX) * 0.065;
      mouseY += (targetMouseY - mouseY) * 0.065;

      // Dynamic 3D Camera Parallax & Cursor-Guided Perspective
      camera.position.x = mouseX * 0.75;
      camera.position.y = -mouseY * 0.75;

      // Subtle dynamic 3D depth warp when moving cursor rapidly
      const mouseSpeed = Math.hypot(targetMouseX - mouseX, targetMouseY - mouseY);
      camera.position.z = 1000 - Math.min(mouseSpeed * 0.18, 160);
      camera.lookAt(scene.position);

      // Continuous subtle cosmic rotation + reactive cursor tilt
      driftY += 0.0004;
      driftX += 0.0002;
      particles.rotation.y = driftY + mouseX * 0.00065;
      particles.rotation.x = driftX - mouseY * 0.00065;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animateScene);
    };

    renderer = init();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    animateScene();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      if (material) material.dispose();
    };
  }, [color, particleCount, particleSize, animate]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}

export default Particles;
