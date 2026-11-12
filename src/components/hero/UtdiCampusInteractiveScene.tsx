"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/**
 * UtdiCampusInteractiveScene
 * 
 * Interactive 3D Lego/Voxel Campus Hero Background inspired by GDGoC IPB:
 * 1. Circling Voxel Birds: Burung voxel 3D yang terbang berputar (orbit) di atas gedung kampus UTDI dengan sayap mengepak.
 * 2. Blinking Voxel Dino: Karakter Chrome Dino bergaya voxel di pelataran kampus yang berkedip secara periodik dan bisa melompat saat diklik.
 * 3. 3D Mouse Parallax: Efek diorama interaktif saat kursor mouse bergerak di area hero.
 * 4. Drifting Pixel Clouds: Awan pixel yang melayang di langit.
 */
export function UtdiCampusInteractiveScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // Bird DOM refs for direct transform updates (zero React re-renders = pure 60fps)
  const bird1Ref = useRef<HTMLDivElement>(null);
  const bird2Ref = useRef<HTMLDivElement>(null);
  const bird3Ref = useRef<HTMLDivElement>(null);

  // Dino interactive state
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDinoJumping, setIsDinoJumping] = useState(false);
  const [dinoMessage, setDinoMessage] = useState<string | null>(null);

  // Dino speech bubble messages
  const DINO_QUOTES = [
    "Rawr! BDC UTDI",
    "Kampus Teknologi Digital!",
    "Belajar Coding bareng BDC!",
    "Semangat Ngoding!",
    "Halo Mahasiswa UTDI!",
  ];

  // 1. DINO BLINKING LOGIC (Periodic natural blinks + occasional double-blink)
  useEffect(() => {
    let blinkTimer: NodeJS.Timeout;
    let isCancelled = false;

    const scheduleNextBlink = () => {
      // Natural interval between 3.2s and 5.8s
      const delay = 3200 + Math.random() * 2600;
      blinkTimer = setTimeout(() => {
        if (isCancelled) return;
        setIsBlinking(true);

        // Blink duration: 150ms
        setTimeout(() => {
          if (isCancelled) return;
          setIsBlinking(false);

          // 25% chance of a quick double blink
          if (Math.random() < 0.25) {
            setTimeout(() => {
              if (isCancelled) return;
              setIsBlinking(true);
              setTimeout(() => {
                if (isCancelled) return;
                setIsBlinking(false);
                scheduleNextBlink();
              }, 130);
            }, 120);
          } else {
            scheduleNextBlink();
          }
        }, 150);
      }, delay);
    };

    scheduleNextBlink();
    return () => {
      isCancelled = true;
      clearTimeout(blinkTimer);
    };
  }, []);

  // 2. DINO INTERACTIVE CLICK
  const handleDinoClick = useCallback(() => {
    if (isDinoJumping) return;
    setIsDinoJumping(true);
    const randomQuote = DINO_QUOTES[Math.floor(Math.random() * DINO_QUOTES.length)];
    setDinoMessage(randomQuote);

    setTimeout(() => {
      setIsDinoJumping(false);
    }, 500);

    setTimeout(() => {
      setDinoMessage(null);
    }, 2800);
  }, [isDinoJumping]);

  // 3. CIRCLING BIRDS & MOUSE PARALLAX ANIMATION LOOP
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

    // Main animation loop
    const render = (now: number) => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (now - startTime) / 1000;

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Apply subtle 3D parallax to the background building
      if (backgroundRef.current) {
        const bgX = currentMouseX * -14;
        const bgY = currentMouseY * -9;
        const tiltX = currentMouseY * 2.5;
        const tiltY = currentMouseX * -3.5;
        backgroundRef.current.style.transform = `translate3d(${bgX}px, ${bgY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
      }

      // Circling birds configuration (Orbit above the UTDI building summit)
      // Base center relative to the bird container
      const rx = 130; // Horizontal orbit radius (px)
      const ry = 42;  // Vertical orbit radius (perspective tilt)
      const speed = 0.55; // Radians per second (~11.4s per full loop)

      const birds = [
        { ref: bird1Ref, offset: 0, scaleBase: 1.0 },
        { ref: bird2Ref, offset: -0.32, scaleBase: 0.88 },
        { ref: bird3Ref, offset: -0.65, scaleBase: 0.78 },
      ];

      birds.forEach(({ ref, offset, scaleBase }) => {
        if (!ref.current) return;
        const angle = elapsed * speed + offset;
        
        // Elliptical coordinates
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;

        // Tangent vector for natural banking rotation
        const dx = -Math.sin(angle) * rx;
        const dy = Math.cos(angle) * ry;
        const headingDeg = Math.atan2(dy, dx) * (180 / Math.PI);

        // Depth perspective: when at the top (sin < 0), bird is further away; when at bottom (sin > 0), bird is closer
        const depthFactor = (Math.sin(angle) + 1) / 2; // 0 (far) to 1 (near)
        const scale = scaleBase * (0.7 + depthFactor * 0.45);
        const opacity = 0.75 + depthFactor * 0.25;
        const zIndex = depthFactor > 0.4 ? 2 : 1;

        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${headingDeg}deg) scale(${scale})`;
        ref.current.style.opacity = String(opacity);
        ref.current.style.zIndex = String(zIndex);
      });

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
      className="absolute inset-0 z-0 overflow-hidden select-none"
      style={{ perspective: "1000px" }}
      aria-hidden="true"
    >
      {/* 1. PARALLAX 3D LEGO CAMPUS BACKGROUND */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 will-change-transform transition-transform duration-75 ease-out pointer-events-none"
      >
        <Image
          src="/environments/utdi-campus-lego.webp"
          alt="Environment 3D Kampus UTDI Yogyakarta Bergaya Lego Voxel"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom md:object-right-bottom opacity-90 transition-opacity duration-700"
        />

        {/* Subtle Dot Matrix Layer */}
        <div className="absolute inset-0 bg-voxel-grid opacity-35" />
      </div>

      {/* 2. CIRCLING VOXEL BIRDS ABOVE THE UTDI BUILDING */}
      {/* Positioned above the right-hand building summit */}
      <div className="absolute top-[16%] right-[12%] sm:right-[18%] md:right-[24%] pointer-events-none z-[2]">
        <div className="relative w-1 h-1">
          {/* Bird 1 (Flock Leader) */}
          <div
            ref={bird1Ref}
            className="absolute -top-3 -left-4 will-change-transform"
          >
            <VoxelBird />
          </div>

          {/* Bird 2 (Follower 1) */}
          <div
            ref={bird2Ref}
            className="absolute -top-3 -left-4 will-change-transform"
          >
            <VoxelBird />
          </div>

          {/* Bird 3 (Follower 2) */}
          <div
            ref={bird3Ref}
            className="absolute -top-3 -left-4 will-change-transform"
          >
            <VoxelBird />
          </div>
        </div>
      </div>

      {/* 3. BLINKING VOXEL CHROME DINO (In the campus plaza/courtyard) */}
      <div className="absolute bottom-[10%] sm:bottom-[12%] md:bottom-[14%] right-[4%] sm:right-[8%] md:right-[14%] z-20">
        <div className="relative group">
          {/* Dino Speech Bubble on click */}
          {dinoMessage && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 animate-bounce">
              <div className="bg-[#fffefa] text-bdc-midnight border-2 border-bdc-midnight px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-retro-sm whitespace-nowrap flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                <span>{dinoMessage}</span>
              </div>
              {/* Bubble caret */}
              <div className="w-2.5 h-2.5 bg-[#fffefa] border-b-2 border-r-2 border-bdc-midnight rotate-45 mx-auto -mt-1.5" />
            </div>
          )}

          {/* Dino Tooltip on Hover */}
          {!dinoMessage && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-bdc-midnight text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-retro-sm whitespace-nowrap">
                Klik Dino!
              </div>
            </div>
          )}

          {/* Interactive Clickable Dino Button */}
          <button
            type="button"
            onClick={handleDinoClick}
            aria-label="Voxel Chrome Dino Kampus UTDI - Klik untuk melompat"
            className={`cursor-pointer transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-bdc-blue rounded-lg ${
              isDinoJumping ? "-translate-y-5 rotate-[-4deg] scale-105" : "hover:-translate-y-1 hover:scale-105"
            }`}
          >
            <VoxelDino isBlinking={isBlinking} isJumping={isDinoJumping} />
          </button>
        </div>
      </div>

      {/* 4. FLOATING PIXEL CLOUDS */}
      <div className="absolute top-10 left-8 md:left-20 opacity-85 animate-float-cloud pointer-events-none z-[1]">
        <Image
          src="/cards/cloud.svg"
          alt="Pixel Cloud"
          width={88}
          height={22}
          className="w-16 md:w-24 h-auto pixelated drop-shadow-sm"
        />
      </div>
      <div className="absolute top-24 right-8 md:right-32 opacity-75 animate-float-cloud-delayed pointer-events-none z-[1]">
        <Image
          src="/cards/cloud.svg"
          alt="Pixel Cloud"
          width={96}
          height={24}
          className="w-20 md:w-28 h-auto pixelated drop-shadow-sm"
        />
      </div>

      {/* 5. GRADIENT WASHES (Smooth blending with paper background) */}
      <div className="absolute inset-x-0 top-0 h-44 hero-wash z-[3] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 hero-bottom-wash z-[3] pointer-events-none" />
    </div>
  );
}

/**
 * VoxelBird
 * Crisp isometric pixel bird with flapping wings
 */
function VoxelBird() {
  return (
    <svg
      viewBox="0 0 34 22"
      width="34"
      height="22"
      className="drop-shadow-sm"
      shapeRendering="crispEdges"
    >
      {/* Bird Body Shadow */}
      <rect x="8" y="18" width="16" height="3" fill="#000741" fillOpacity="0.2" rx="1" />

      {/* Tail Feathers */}
      <rect x="0" y="8" width="6" height="4" fill="#1e293b" />
      <rect x="2" y="12" width="4" height="2" fill="#0f172a" />

      {/* Main Body */}
      <rect x="6" y="6" width="16" height="8" fill="#334155" />
      {/* Light Cream Chest */}
      <rect x="12" y="10" width="8" height="4" fill="#FAF9F2" />

      {/* Head */}
      <rect x="20" y="4" width="7" height="7" fill="#1e293b" />
      {/* Eye */}
      <rect x="23" y="5" width="2" height="2" fill="#FFFFFF" />
      <rect x="24" y="6" width="1" height="1" fill="#000741" />

      {/* Voxel Golden Beak */}
      <rect x="27" y="7" width="5" height="3" fill="#E9AD17" />

      {/* Left Wing (Animated flapping) */}
      <g className="animate-wing-flap origin-[14px_6px]">
        <rect x="10" y="0" width="8" height="6" fill="#475569" />
        <rect x="12" y="0" width="4" height="3" fill="#64748b" />
      </g>
    </svg>
  );
}

/**
 * VoxelDino
 * Google Chrome T-Rex in 3D tactile voxel blocks with blinking eye
 */
function VoxelDino({ isBlinking, isJumping }: { isBlinking: boolean; isJumping: boolean }) {
  return (
    <div className="relative select-none">
      <svg
        viewBox="0 0 76 84"
        width="76"
        height="84"
        className="w-14 sm:w-16 md:w-20 h-auto filter drop-shadow-md transition-transform"
        shapeRendering="crispEdges"
      >
        {/* Ground Voxel Shadow */}
        <ellipse
          cx="38"
          cy="80"
          rx={isJumping ? "22" : "30"}
          ry="5"
          fill="#000741"
          fillOpacity={isJumping ? "0.15" : "0.3"}
          className="transition-all duration-200"
        />

        {/* Dino Body Group */}
        <g id="dino-voxel-character">
          {/* Head & Snout */}
          <rect x="36" y="4" width="34" height="18" fill="#1e293b" rx="1" />
          <rect x="38" y="2" width="18" height="2" fill="#334155" />
          
          {/* Lower Jaw & Snout Mouth */}
          <rect x="36" y="22" width="34" height="8" fill="#1e293b" />
          {/* Teeth / Mouth Gap */}
          <rect x="52" y="22" width="18" height="3" fill="#FAF9F2" />
          <rect x="36" y="30" width="16" height="5" fill="#1e293b" />

          {/* DINO BLINKING EYE */}
          {isBlinking ? (
            /* Closed Eye Slit */
            <g id="dino-eye-closed">
              <rect x="42" y="11" width="8" height="2.5" fill="#000741" rx="0.5" />
            </g>
          ) : (
            /* Open Eye with Pupil */
            <g id="dino-eye-open">
              <rect x="42" y="7" width="8" height="8" fill="#FFFFFF" stroke="#000741" strokeWidth="1" />
              <rect x="46" y="9" width="3" height="3" fill="#000741" />
            </g>
          )}

          {/* Neck & Chest */}
          <rect x="30" y="22" width="12" height="14" fill="#1e293b" />
          
          {/* Torso */}
          <rect x="18" y="32" width="26" height="26" fill="#1e293b" rx="1" />
          {/* Torso 3D highlight edge */}
          <rect x="20" y="32" width="22" height="2" fill="#334155" />

          {/* Cute T-Rex Pixel Arm */}
          <rect x="40" y="38" width="10" height="4" fill="#334155" />
          <rect x="46" y="42" width="4" height="4" fill="#334155" />

          {/* Tail */}
          <rect x="4" y="36" width="6" height="6" fill="#1e293b" />
          <rect x="9" y="38" width="5" height="8" fill="#1e293b" />
          <rect x="13" y="40" width="6" height="12" fill="#1e293b" />

          {/* Back Leg */}
          <rect x="22" y="58" width="6" height="16" fill="#1e293b" />
          <rect x="22" y="72" width="12" height="5" fill="#1e293b" rx="1" />

          {/* Front Leg */}
          <rect x="32" y="58" width="6" height="16" fill="#1e293b" />
          <rect x="32" y="72" width="12" height="5" fill="#1e293b" rx="1" />
        </g>
      </svg>
    </div>
  );
}
