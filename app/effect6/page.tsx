"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export default function TerminalSystemWipe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWiped, setIsWiped] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "guest@core:~# Initialize marketing layer...",
    "Core canvas standard execution: OK"
  ]);

  // Track scroll coordinates over this transition block
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Map the laser line sweep across the entire height of the screen (0% to 100%)
  const laserY = useTransform(scrollYProgress, [0.1, 0.6], ["-5vh", "105vh"]);
  
  // 2. Hide the laser before it starts sweeping and after it finishes
  const laserOpacity = useTransform(scrollYProgress, [0.05, 0.1, 0.6, 0.65], [0, 1, 1, 0]);

  // 3. Dynamic clip path to cut the dark background layer in sync with the laser line
  const darkCanvasClip = useTransform(
    scrollYProgress,
    [0.1, 0.6],
    ["polygon(0 0, 100 0, 100% 0%, 0% 0%)", "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"]
  );

  // Monitor scroll to trigger terminal feedback logs exactly when the laser initializes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.1 && !isWiped) {
      setIsWiped(true);
      setTerminalLogs((prev) => [
        ...prev,
        "> apex render --section-2 --force",
        "⚙️ [KERNEL] Initializing pipeline wipe...",
        "✔ [RENDER] Swapping layout matrices... [100%]"
      ]);
    } else if (latest < 0.1 && isWiped) {
      setIsWiped(false);
      setTerminalLogs([
        "guest@core:~# Initialize marketing layer...",
        "Core canvas standard execution: OK"
      ]);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[220vh] bg-slate-900">
      
      {/* STICKY RENDER PIPELINE CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none">
        
        {/* BASE LAYER (The "Before"): Light Marketing Screen */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-zinc-300 flex items-center p-8 lg:p-24">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 uppercase">
              Environment Layout A
            </span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              The high-level product surface.
            </h1>
            <p className="text-slate-600 leading-relaxed">
              This represents your standard marketing presentation layer. Crisp typography, light color palettes, and friendly consumer spacing. Scroll down to force the core rendering overhaul.
            </p>
          </div>
        </div>

        {/* OVERLAY LAYER (The "After"): Dark Charcoal System Canvas */}
        {/* Its visibility is tied strictly to the polygon slice dictated by the laser position */}
        <motion.div 
          style={{ clipPath: darkCanvasClip }}
          className="absolute inset-0 bg-zinc-950 flex items-center p-8 lg:p-24 z-10"
        >
          {/* Tactical grid background accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
          
          <div className="max-w-xl space-y-4 relative z-20">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              // ENVIRONMENT LAYOUT B // CHARCOAL_CORE
            </span>
            <h1 className="text-5xl font-black text-white tracking-tight">
              The compiled architecture.
            </h1>
            <p className="text-zinc-400 leading-relaxed">
              The pipeline wipe converts the page assets cleanly into a pure obsidian engineering setup. Optimized for deep focus, documentation deep-dives, and performance matrix configurations.
            </p>
          </div>
        </motion.div>

        {/* ================= THE LASER EDGE BEAM ================= */}
        <motion.div 
          style={{ y: laserY, opacity: laserOpacity }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981,0_0_30px_#10b981] z-30 pointer-events-none"
        />

        {/* FIXED RIGHT SIDEBAR: Terminal Control Hub */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-[420px] h-[320px] z-40">
          <div className="w-full h-full bg-black/90 border border-zinc-800 rounded-lg shadow-2xl shadow-black/80 font-mono text-xs overflow-hidden flex flex-col backdrop-blur-md">
            
            {/* Window Chrome Header */}
            <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                core-pipeline.sh
              </span>
              <div className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">TTY02</div>
            </div>

            {/* Live Terminal Log Streams */}
            <div className="p-6 flex-1 flex flex-col justify-end space-y-1.5 overflow-hidden">
              {terminalLogs.map((log, idx) => (
                <motion.p 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    log.startsWith('>') 
                      ? "text-emerald-400 font-bold mt-2" 
                      : log.startsWith('✔') || log.includes('OK')
                      ? "text-emerald-500"
                      : "text-zinc-500"
                  }
                >
                  {log}
                </motion.p>
              ))}
              <div className="flex items-center text-zinc-400 pt-1">
                <span>$ </span>
                <span className="animate-pulse bg-emerald-400 ml-1 inline-block w-1.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* FOOTER SCROLL BOUNDARY ANCHOR */}
      <div className="h-[100vh] pointer-events-none" />
    </div>
  );
}