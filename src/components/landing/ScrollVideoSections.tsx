"use client";

import { ReactNode, useEffect, useRef } from "react";

export function ScrollVideoSections({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    const videoLayer = videoLayerRef.current;
    if (!stage || !video || !videoLayer) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      const distance = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
      const isInStage = rect.top <= window.innerHeight && rect.bottom >= 0;

      videoLayer.dataset.scrollVisible = String(isInStage);

      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        video.currentTime = progress === 0 ? 0 : progress * video.duration;
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

    const resetToFirstFrame = () => {
      video.currentTime = 0;
      requestUpdate();
    };

    video.addEventListener("loadedmetadata", resetToFirstFrame);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      video.removeEventListener("loadedmetadata", resetToFirstFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stageRef} className="relative isolate">
      <div
        ref={videoLayerRef}
        data-scroll-visible="false"
        className="fixed inset-0 z-0 h-[100svh] overflow-hidden pointer-events-none opacity-0 data-[scroll-visible=true]:opacity-100"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-100"
          src="/videos/bdc-scroll.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-bdc-surface/5" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
