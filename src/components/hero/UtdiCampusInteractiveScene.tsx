"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * UtdiCampusInteractiveScene (Pilihan 1: Interactive 3D Diorama & Ambient Motion)
 * 
 * - Background gedung kampus UTDI 3D Lego Voxel
 * - Interactive Mouse Parallax 3D Tilt (merespons gerakan kursor mouse secara halus)
 * - Ambient Idle Floating / Breathing Motion (mengapung halus saat kursor diam)
 * - Multi-layer Floating Pixel Clouds & Dot Matrix
 * - Zero extra creature/animal sprites (clean & professional)
 * - 60 FPS hardware-accelerated via CSS transforms (translate3d & rotate3d)
 */
export function UtdiCampusInteractiveScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();
    let isTabVisible = true;

    // Track mouse coordinates (-1 to 1) with smooth easing (lerp)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetMouseX = Math.max(-1, Math.min(1, x));
      targetMouseY = Math.max(-1, Math.min(1, y));
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Main 60 FPS animation loop
    const render = (now: number) => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (now - startTime) / 1000;

      // Smooth mouse lerp (dampening)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Subtle ambient idle breathing (gentle sine float)
      const idleFloatY = Math.sin(elapsed * 1.2) * 3;
      const idleTilt = Math.sin(elapsed * 0.8) * 0.5;

      // Apply 3D diorama parallax & ambient float to the Lego campus background
      if (backgroundRef.current) {
        const bgX = currentMouseX * -15;
        const bgY = currentMouseY * -10 + idleFloatY;
        const tiltX = currentMouseY * 2.8 + idleTilt;
        const tiltY = currentMouseX * -3.8;
        backgroundRef.current.style.transform = `translate3d(${bgX}px, ${bgY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-auto"
      style={{ perspective: "1000px" }}
      aria-hidden="true"
    >
      {/* 1. PARALLAX 3D LEGO CAMPUS BACKGROUND WITH AMBIENT FLOAT (Compressed Loop Video & Poster) */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 will-change-transform transition-transform duration-75 ease-out pointer-events-none"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/environments/utdi-campus-lego.webp"
          className="w-full h-full object-cover object-bottom md:object-right-bottom opacity-90 transition-opacity duration-700"
        >
          <source src="/environments/utdi-hero-lego.webm" type="video/webm" />
          <source src="/environments/utdi-hero-lego.mp4" type="video/mp4" />
        </video>

        {/* Subtle Dot Matrix Layer */}
        <div className="absolute inset-0 bg-voxel-grid opacity-35" />
      </div>

      {/* 2. FLOATING PIXEL CLOUDS */}
      <div className="absolute top-10 left-8 md:left-24 opacity-85 animate-float-cloud pointer-events-none z-[1]">
        <Image
          src="/cards/cloud.svg"
          alt="Pixel Cloud"
          width={88}
          height={22}
          className="w-16 md:w-24 h-auto pixelated drop-shadow-sm"
        />
      </div>
      <div className="absolute top-24 right-8 md:right-36 opacity-75 animate-float-cloud-delayed pointer-events-none z-[1]">
        <Image
          src="/cards/cloud.svg"
          alt="Pixel Cloud"
          width={96}
          height={24}
          className="w-20 md:w-28 h-auto pixelated drop-shadow-sm"
        />
      </div>

      {/* 3. GRADIENT WASHES (Smooth blending with paper canvas) */}
      <div className="absolute inset-x-0 top-0 h-44 hero-wash z-[2] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 hero-bottom-wash z-[2] pointer-events-none" />
    </div>
  );
}
