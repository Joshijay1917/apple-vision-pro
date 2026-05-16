'use client';

'use client';

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import bgImage from '@/public/bg2.png';

function DynamicLightingBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Maps the scroll to move the intense beam across the architectural slits
  const gradientPosition = `${scrollProgress * 100}%`;

  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-black">
      {/* Next.js Optimized Background Image */}
      <Image
        src={bgImage}
        alt="Architectural concrete columns background"
        placeholder="blur"
        quality={95} // Higher quality to keep the gradient transitions smooth
        fill
        sizes="100vw"
        priority
        className="object-cover object-center brightness-[0.85]" // Slightly dimming base image to make the light beam pop more violently
      />

      {/* Primary High-Intensity Light Beam (Screen Mode for Raw Brightness) */}
      <div 
        className="absolute inset-0 mix-blend-screen pointer-events-none transition-all duration-500 ease-out opacity-50"
        style={{
          background: `linear-gradient(
            115deg, 
            rgba(255, 255, 255, 0) 10%, 
            rgba(255, 255, 255, 0.25) 35%, 
            rgba(255, 255, 255, 0.65) 50%, 
            rgba(255, 255, 255, 0.25) 65%, 
            rgba(255, 255, 255, 0) 90%
          )`,
          backgroundSize: '250% 100%', // Marginally tighter spread makes the beam look sharper and punchier
          backgroundPositionX: gradientPosition,
        }}
      />

      {/* Secondary Volumetric Glow (Overlay Mode to saturate concrete highlights) */}
      <div 
        className="absolute inset-0 mix-blend-overlay pointer-events-none transition-all duration-500 ease-out opacity-60"
        style={{
          background: `linear-gradient(
            115deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.4) 50%, 
            rgba(255, 255, 255, 0) 100%
          )`,
          backgroundSize: '250% 100%',
          backgroundPositionX: gradientPosition,
        }}
      />

      {/* Vignette - Keeps the edges dark to emphasize the central blinding light */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none from-transparent via-black/10 to-black/70" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-[300vh] text-white selection:bg-white selection:text-black">
      {/* Background Component */}
      <DynamicLightingBackground />

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center px-8 md:px-24 max-w-4xl">
        <span className="text-xs uppercase tracking-[0.5em] text-gray-400 mb-4 block">Architectural Precision</span>
        <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-none mb-6">
          SHAPING <br /> THE VOID.
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-md font-light leading-relaxed">
          Scroll down to watch the natural progression of light dance across brutalist, monolithic concretes.
        </p>
        <div className="mt-12 animate-bounce text-sm text-gray-500 tracking-widest">↓ SCROLL</div>
      </section>

      {/* Section 2 (Midway through light shift) */}
      <section className="h-screen flex items-center justify-end px-8 md:px-24">
        <div className="max-w-md text-right">
          <h2 className="text-3xl font-light tracking-tight mb-4">Dynamic Interplay</h2>
          <p className="text-gray-400 font-light text-sm leading-relaxed">
            As you move, the synthetic sun repositions, casting new emphasis on the vertical slit columns and overhanging brutalist tiers.
          </p>
        </div>
      </section>

      {/* Section 3 (Final light position) */}
      <section className="h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-xl">
          <h2 className="text-4xl font-light tracking-widest mb-4 uppercase">Total Eclipse</h2>
          <p className="text-gray-500 font-light text-xs tracking-wider">
            FIN. DESIGN DRIVEN BY NATURAL MATHEMATICS.
          </p>
        </div>
      </section>
    </main>
  );
}