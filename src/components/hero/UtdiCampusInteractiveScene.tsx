import Image from "next/image";

/**
 * UtdiCampusInteractiveScene
 * 
 * - Background gedung kampus UTDI Lego Voxel (video loop & fallback poster)
 * - Tampilan flat & stabil tanpa efek tilt / angkat 3D saat kursor mendekat
 * - Multi-layer Floating Pixel Clouds & Dot Matrix
 * - Zero JS overhead (Server Component)
 */
export function UtdiCampusInteractiveScene() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* 1. LEGO CAMPUS BACKGROUND (Compressed Loop Video & Poster) */}
      <div className="absolute inset-0 pointer-events-none">
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

      {/* 3. GRADIENT WASHES (Smooth top & bottom blending with paper canvas) */}
      <div className="absolute inset-x-0 top-0 h-44 hero-wash z-[2] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 hero-bottom-wash z-[2] pointer-events-none" />
    </div>
  );
}

