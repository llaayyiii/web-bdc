"use client";

import { ReactNode, useEffect, useRef } from "react";

export function ScrollVideoSections({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      const distance = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1);

      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        video.currentTime = progress * video.duration;
      }

      const sections = Array.from(stage.querySelectorAll<HTMLElement>(".scroll-act"));
      const activeSection = sections.find((section) => {
        const sectionRect = section.getBoundingClientRect();
        return sectionRect.top <= window.innerHeight * 0.55 &&
          sectionRect.bottom >= window.innerHeight * 0.4;
      });

      sections.forEach((section) => {
        section.dataset.scrollActive = String(section === activeSection);
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    video.addEventListener("loadedmetadata", requestUpdate);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      video.removeEventListener("loadedmetadata", requestUpdate);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stageRef} className="relative isolate">
      <div className="sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src="/videos/bdc-scroll.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-bdc-surface/55" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
