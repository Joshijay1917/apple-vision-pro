"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function MatrixDepthBlur() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll timeline over the entire content height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Dynamic Blur: Gradually increase from 0px to 24px as you scroll down
  const blurAmount = useTransform(scrollYProgress, [0, 0.6], ["blur(0px)", "blur(24px)"]);

  // 2. Ambient Dimming: Gradually darken the layer slightly to boost text readability
  const filterOverlay = useTransform(
    scrollYProgress, 
    [0, 0.6], 
    ["rgba(9, 9, 11, 0.2)", "rgba(9, 9, 11, 0.75)"]
  );

  // 3. Scale-out text animation: Subtle fade and drift upwards for incoming layout blocks
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.4, 0.7], [60, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-zinc-950">
      
      {/* FIXED CAMERA BACKGROUND WRAPPER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* The Base Concrete / Architectural Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('/bg2.png')`, // Concrete pillars, hard geometry, raw architecture
          }}
        />

        {/* ================= THE DEPTH BLUR CONTROLLER ================= */}
        {/* This layer sits perfectly on top of the image and applies the progressive blur matrix */}
        <motion.div 
          style={{ 
            backdropFilter: blurAmount,
            WebkitBackdropFilter: blurAmount, // Essential Safari support
            backgroundColor: filterOverlay
          }}
          className="absolute inset-0 transition-colors duration-200 pointer-events-none z-10"
        />

        {/* FRONT SURFACE CONTENT SPACE */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-24 max-w-7xl mx-auto w-full">
          
          {/* Phase A Content (Visible at the very start) */}
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
            className="max-w-xl mt-[15vh]"
          >
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase bg-black/40 px-3 py-1 rounded border border-zinc-800 backdrop-blur-sm">
              Focus Vector // Sharp Geometry
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mt-4">
              Structural clarity.
            </h1>
            <p className="text-zinc-200 mt-4 leading-relaxed bg-black/20 rounded backdrop-blur-[2px] p-2">
              Every detail is perfectly defined. The physical concrete lines anchor the initial visual layout frame. Scroll down to see the architecture shift depth.
            </p>
          </motion.div>

          {/* Phase B Content (Fades in perfectly as the background dissolves into abstract ambiance) */}
          <motion.div 
            style={{ opacity: textOpacity, y: textY }}
            className="max-w-2xl mb-[15vh] ml-auto text-right flex flex-col items-end space-y-4"
          >
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase bg-emerald-950/30 px-3 py-1 rounded border border-emerald-500/20 backdrop-blur-sm">
              // DEPTH_DISSOLVE_COMPLETE
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Distraction-free focus mode.
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-md">
              The concrete geometry has dissolved completely into an abstract texture. No harsh lines remain, turning the canvas into a high-contrast landing field for documentation grids or technical summaries.
            </p>
            
            {/* Sample Dashboard Mini-Block over the blurred texture */}
            <div className="w-full text-left bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6 font-mono text-xs text-zinc-400 shadow-2xl backdrop-blur-md mt-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3 text-zinc-500">
                <span>SYSTEM_DIAGNOSTIC_LOGS</span>
                <span>STATUS: STABLE</span>
              </div>
              <p className="text-emerald-400 font-semibold">✔ CAMERA_BLUR_COEFFICIENT: 24px (MAX)</p>
              <p>✔ GEOMETRIC_EDGES_MUTED: TRUE</p>
              <p>✔ CONTRAST_RATIO_OPTIMIZED: 4.5:1</p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* TIMELINE ANCHOR SPACE */}
      <div className="h-[100vh] pointer-events-none" />
    </div>
  );
}