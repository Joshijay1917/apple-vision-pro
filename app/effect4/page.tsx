"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function TerminalTakeover() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress strictly across this transition zone
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Clip path wipe: Reveals the dark terminal layer from bottom to top
  // Wipes from 100% (hidden) to 0% (fully covering the screen) midway through the scroll
  const clipPathWipe = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"]
  );

  // 2. Cinematic Background Effects (Parallax shrink + heavy blur out)
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(20px)"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 3. CRT Glitch/Flicker Trigger: Intense flicker right as the wipe finishes
  const crtFlicker = useTransform(scrollYProgress, [0.4, 0.45, 0.5, 0.55, 0.6], [1, 0.4, 0.9, 0.2, 1]);
  // Horizontal screen stretch distortion simulation
  const crtScaleX = useTransform(scrollYProgress, [0.45, 0.5, 0.55], [1, 1.03, 1]);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-slate-950">
      
      {/* STICKY VISUAL WRAPPER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* LAYER 1: CINEMATIC HERO BACKGROUND (The "Before") */}
        <motion.div 
          style={{ scale: heroScale, filter: heroBlur, opacity: heroOpacity }}
          className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-slate-900 to-purple-900 flex flex-col justify-center items-center p-6 text-center"
        >
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Introducing Core Engine v3.0
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
              Beautiful code. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400">
                Deployable instantly.
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto">
              Experience the world's most intuitive cloud console. Scroll down to look under the hood.
            </p>
            <div className="pt-8 animate-bounce text-indigo-400 text-sm font-mono">
              ↓ SCROLL TO DEPLOY
            </div>
          </div>
        </motion.div>


        {/* LAYER 2: THE TERMINAL TAKEOVER (The "After" Wiping Layer) */}
        <motion.div 
          style={{ 
            clipPath: clipPathWipe, 
            opacity: crtFlicker,
            scaleX: crtScaleX
          }}
          className="absolute inset-0 bg-black flex flex-col justify-center items-center p-8 select-none z-20"
        >
          {/* CRT Monitor Effect Overlays */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-30" />
          
          {/* Obsidian Matrix/Terminal Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#042f1a_1px,transparent_1px),linear-gradient(to_bottom,#042f1a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

          {/* Terminal Content Box */}
          <div className="w-full max-w-4xl font-mono text-emerald-400 p-8 border border-emerald-900/40 bg-zinc-950/80 rounded shadow-[0_0_50px_rgba(4,47,26,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4 mb-4 text-xs text-emerald-600">
              <div>HOST: AM_CORE_SANDBOX // TTY01</div>
              <div className="animate-pulse font-bold">● FOCUS MODE ACTIVE</div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="text-emerald-600">// DEEP WORK ENVIRONMENT INITIALIZED SUCCESSFULY</p>
              <p><span className="text-zinc-500"> $</span> root --config ./pricing-tiers.yaml</p>
              <p className="text-zinc-400"> Loading production ledger indexes... Done.</p>
              <p className="text-zinc-400"> Compiling modular infrastructure matrices... Done.</p>
            </div>

            {/* Simulated interactive component skeleton inside the new mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {[
                { title: "Sandbox", price: "$0", desc: "For local evaluation vectors." },
                { title: "Production Cluster", price: "$49/mo", desc: "Full mesh networking layer enabled." },
                { title: "Bare Metal", price: "Custom", desc: "Direct hardware execution paths." }
              ].map((tier, i) => (
                <div key={i} className="border border-emerald-900/30 bg-black/60 p-4 rounded hover:border-emerald-500/50 transition-colors duration-300">
                  <div className="text-xs text-emerald-600 mb-1">TIER_0{i+1}</div>
                  <div className="text-lg font-bold text-white">{tier.title}</div>
                  <div className="text-xl font-bold my-1 text-emerald-300">{tier.price}</div>
                  <div className="text-xs text-zinc-500 line-clamp-2">{tier.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Spacer to give the page scrolling room to actuate the timeline */}
      <div className="h-[100vh] pointer-events-none" />
    </div>
  );
}