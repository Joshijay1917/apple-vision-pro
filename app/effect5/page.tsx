"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WebXRExposure() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress through the interaction section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Linear wipe effect: shifts a linear-gradient mask downward as the user scrolls
  // Maps 0% to 100% of the timeline to a CSS mask percentage transition
  const maskPercentage = useTransform(scrollYProgress, [0.1, 0.8], [0, 100]);
  
  // Tie the mask to a CSS custom string injection
  const maskStyle = useTransform(
    maskPercentage,
    (latest) => `linear-gradient(to bottom, transparent ${latest}%, black ${latest + 15}%)`
  );

  // Subtle zoom effect on both layers to make the scroll feel deeply organic
  const structuralScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-zinc-950">
      
      {/* STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* STRUCTURAL CONTENT CONTAINER (Gives both layers identical positioning) */}
        <motion.div 
          style={{ scale: structuralScale }}
          className="relative w-full h-full max-w-7xl max-h-[80vh] mx-auto px-6 lg:px-8"
        >
          
          {/* LAYER 1: THE MONOCHROME WIREFRAME (The Blueprint Foundation) */}
          {/* This layer sits in the back, untouched, rendering sharp vector outlines */}
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-2xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]"
            style={{ 
              backgroundImage: `url('/bg2-wireframe.svg')`, // SVG line art or green/white high-contrast render
              backgroundColor: "#09090b"
            }}
          >
            {/* Holographic matrix grid overlay for that WebXR development canvas vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-[0.03] rounded-2xl" />
            
            {/* Abstract HUD tags rendering over the architecture */}
            <div className="absolute bottom-8 left-8 font-mono text-xs text-emerald-400 space-y-1 z-10 hidden md:block bg-zinc-950/80 p-3 rounded border border-emerald-500/20 backdrop-blur-sm">
              <p className="text-emerald-500 font-bold">// WEBXR_ENGINE_INIT</p>
              <p>VERTICES: 142,409</p>
              <p>RENDER_MODE: MONO_WIREFRAME</p>
            </div>
          </div>

          {/* LAYER 2: THE REALISTIC LAYER (The Polished Surface) */}
          {/* This layer sits directly on top and gets wiped away by the CSS mask */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center rounded-2xl border border-zinc-800"
            style={{ 
              backgroundImage: `url('bg2.png')`, // Concrete textures, real shadows, rich grading
              WebkitMaskImage: maskStyle,
              maskImage: maskStyle
            }}
          >
            {/* Text that rolls down with the physical texture layer */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 text-white bg-gradient-to-t from-black/80 via-transparent to-black/30 rounded-2xl">
              <div className="max-w-md">
                <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-700 backdrop-blur-sm">
                  Phase 01 // Surface Architecture
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4 text-zinc-100">
                  Built on rock-solid fundamentals.
                </h2>
              </div>
              <p className="text-zinc-400 text-sm max-w-sm leading-relaxed hidden sm:block">
                What you see is a sleek, reliable interface. Scroll down to expose the structural engineering driving the entire core layout.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* FOOTER LABELING (Spacers to feed coordinates to the timeline) */}
      <div className="h-[100vh] pointer-events-none" />
    </div>
  );
}