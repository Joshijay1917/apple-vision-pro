"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function UpdatedRockyPanoramaPage() {
  // --- 3D TILT LOGIC (Aceternity UI Interaction Mechanic) ---
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- STAGGERED ENTRANCE VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const leftPanelVariants = {
    hidden: { opacity: 0, x: -40, rotateY: 25, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotateY: 8, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const rightPanelVariants = {
    hidden: { opacity: 0, x: 40, rotateY: -25, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotateY: 0, // Set to 0 initially, hand over control to custom spring transforms once loaded
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const globalUiVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#060608] text-white font-sans select-none">
      
      {/* Background Image Pass-through with Mount Scale/Unblur */}
      <motion.div 
        initial={{ scale: 1.12, filter: "blur(10px)", opacity: 0 }}
        animate={{ scale: 1.05, filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/bg2.png"
          alt="Environment Background"
          fill
          priority
          quality={100}
          className="object-cover object-center brightness-[0.7] contrast-[1.05]"
        />
        {/* Soft blur vignette simulating glass focal depth */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
      </motion.div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top Floating Navbar Strip */}
      <motion.header 
        initial="hidden"
        animate="visible"
        variants={{globalUiVariants}}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-lg"
      >
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-blue-500/40 bg-blue-500/10 rounded-lg">
              <div className="h-2.5 w-2.5 rotate-45 border border-blue-400" />
            </div>
            <h1 className="text-sm font-bold tracking-[0.15em]">
              APEX <span className="text-blue-400">HORIZON</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden gap-8 text-xs font-medium text-stone-300/80 md:flex">
            {["Products", "Services", "Pricing", "Contact"].map((link) => (
              <a key={link} href="#" className="transition hover:text-white hover:scale-105 active:scale-95">
                {link}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <button className="rounded-xl border border-white/10 bg-white text-stone-950 px-4 py-2 text-xs font-semibold transition hover:bg-stone-200 active:scale-98 shadow-md">
            Get Started →
          </button>
        </div>
      </motion.header>

      {/* Spatial Perspective Workspace Viewport */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-20 flex min-h-screen w-full items-center px-6 md:px-12 lg:px-20 py-24"
        style={{ perspective: "1400px" }}
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          
          {/* Left Canvas Window */}
          <motion.div 
            variants={{leftPanelVariants}}
            className="flex flex-col justify-center items-start relative p-4"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="mb-4 inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-mono tracking-widest text-blue-300 backdrop-blur-md rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              // SaaS Studio & Engineering
            </div>

            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.15] md:text-6xl text-white tracking-tight drop-shadow-md">
              We build software <br />
              that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">actually ships.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-300/80 font-normal drop-shadow-sm">
              Apex Horizon is a precision software studio. We design subscription-ready products and engineered local integrations for systems built to scale.
            </p>

            {/* Content Button Controls */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-xl bg-blue-600 border border-blue-500 px-6 py-3.5 text-xs font-bold tracking-wider uppercase transition hover:bg-blue-500 hover:scale-[1.02] active:scale-98 shadow-lg shadow-blue-600/10">
                View Products
              </button>
              <button className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-xs font-bold tracking-wider uppercase backdrop-blur-md transition hover:bg-white/[0.1] hover:border-white/20">
                Start a Project
              </button>
            </div>
          </motion.div>

          {/* Interactive Floating Interface Node (Right Panel) */}
          <motion.div 
            variants={{rightPanelVariants}}
            className="flex items-center justify-center py-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 shadow-[0_40px_90px_rgba(0,0,0,0.65)] backdrop-blur-3xl relative group cursor-pointer transition-colors duration-300 hover:border-white/15"
            >
              {/* Inner Specular Pass Highlight */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.06] pointer-events-none" />

              {/* Display Canvas Shell */}
              <div 
                className="w-full rounded-xl overflow-hidden bg-stone-950/40 relative flex flex-col p-6 border border-white/[0.04]"
                style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
              >
                {/* Simulated Glass Window Title Bar */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
                  <div className="flex gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                    apex-horizon // network-node
                  </span>
                </div>

                {/* Dashboard Output Matrix */}
                <div className="space-y-5 font-mono text-xs md:text-sm text-stone-200">
                  <div className="space-y-2">
                    <p className="text-stone-500">
                      <span className="text-blue-400">❯</span> apex status --all
                    </p>
                    <div className="space-y-1.5 pl-3">
                      <p className="text-emerald-400 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" /> ✓ inventory-manager running
                      </p>
                      <p className="text-stone-400 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-400" /> — client-sites <span className="text-blue-400 underline decoration-blue-400/30">3 live</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="text-stone-500">
                      <span className="text-blue-400">❯</span> apex products --list
                    </p>
                    <div className="space-y-1 pl-3 text-stone-300">
                      <p>[01] WhatsApp Inventory Manager</p>
                      <p className="text-stone-500">[02] Email Nexus <span className="text-amber-400/70 text-xs font-sans font-normal">// coming soon</span></p>
                    </div>
                  </div>

                  {/* Terminal Cursor Entry Point */}
                  <div className="flex items-center gap-2 text-blue-400 pt-1">
                    <span>❯</span>
                    <div className="h-4 w-1.5 animate-pulse bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {/* Bottom Metrics Pill Bar */}
      <motion.footer 
        initial="hidden"
        animate="visible"
        variants={{footerVariants}}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-5xl rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl py-6 px-8 shadow-2xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {[
            { number: "2+", label: "SaaS products built" },
            { number: "100%", label: "Custom engineered" },
            { number: "Sub-ready", label: "Core structures" },
            { number: "24/7", label: "Uptime target" },
          ].map((item, i) => (
            <div key={i} className="border-r border-white/5 last:border-0 pr-4">
              <p className="text-[9px] font-mono tracking-[0.2em] text-blue-400 uppercase">
                // System.0{i + 1}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                {item.number}
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </motion.footer>

    </section>
  );
}