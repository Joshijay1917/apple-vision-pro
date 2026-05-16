"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

// Section data with corresponding terminal commands
const SECTIONS = [
  {
    id: "hero",
    title: "The Next Generation Enterprise Terminal",
    content: "Deploy globally, scale effortlessly, and manage your infrastructure with a localized sandbox that matches production 1:1. Scroll to initialize system checks.",
    command: "systemctl status enterprise-core.service",
    output: ["● enterprise-core.service - Core Engine", "   Active: active (running) since Fri 2026-05-15", "   Tasks: 42 (limit: 4915)", "   Main PID: 1042 (node)"]
  },
  {
    id: "diagnostics",
    title: "Apex Diagnostics & Monitoring",
    content: "Real-time telemetry gives you deep visibility into every container, edge function, and DB query. Detect anomalies before they impact your users.",
    command: "apex diagnostics --live --verbose",
    output: ["Checking network latency... OK (12ms)", "Analyzing memory heaps... Stable", "Thread pool utilization: 24%", "All systems operational. No anomalies found."]
  },
  {
    id: "case-studies",
    title: "Proven at Scale",
    content: "See how Fortune 500 companies migrated from legacy architectures to our decentralized mesh network, cutting egress costs by up to 64%.",
    command: "fetch ./case-studies/enterprise-mesh.json",
    output: ["Connecting to cdn.enterprise.internal...", "200 OK - Fetching metrics", "↳ Cost reduction: -64.2%", "↳ Uptime increase: +0.03% (99.999%)"]
  }
];

export default function ParallaxLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  // 1. Track overall page scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 2. Parallax: Terminal moves slower. 
  // It transforms from 0px to 300px downward relative to its container as you scroll.
  const terminalY = useTransform(scrollYProgress, [0, 1], ["0px", "300px"]);

  // 3. Track scroll progress to update the terminal content based on active section
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Dynamically calculate which section is currently in view
    const sectionIndex = Math.min(
      Math.floor(latest * SECTIONS.length),
      SECTIONS.length - 1
    );
    if (sectionIndex !== activeSection) {
      setActiveSection(sectionIndex);
    }
  });

  return (
    <div ref={containerRef} className="relative min-h-[300vh] bg-slate-950 text-slate-100 font-sans">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-2 gap-12 pt-24 pb-48">
        
        {/* LEFT COLUMN: Natural Scrolling Content */}
        <div className="space-y-[60vh]"> {/* Large spacing to force scrolling between sections */}
          {SECTIONS.map((section, idx) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -40% 0px", once: false }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center min-h-[40vh]"
            >
              <span className="text-emerald-400 font-mono text-sm mb-2">// 0{idx + 1}. SECTION</span>
              <h2 className="text-4xl font-bold tracking-tight text-white mb-4">{section.title}</h2>
              <p className="text-lg text-slate-400 leading-relaxed">{section.content}</p>
            </motion.section>
          ))}
        </div>

        {/* RIGHT COLUMN: Sticky Container + Slower Parallax Terminal */}
        <div className="hidden lg:block sticky top-24 h-[calc(100vh-12rem)] z-10">
          <motion.div 
            style={{ y: terminalY }} 
            className="w-full h-fit bg-slate-900 border border-slate-800 rounded-lg shadow-2xl shadow-emerald-950/20 overflow-hidden font-mono text-sm"
          >
            {/* Terminal Window Header */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs text-slate-500 select-none">bash — preview-sandbox</span>
              <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Terminal Content Body */}
            <div className="p-6 space-y-4 min-h-[320px] text-slate-300">
              <TerminalDisplay 
                command={SECTIONS[activeSection].command} 
                output={SECTIONS[activeSection].output} 
              />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

// Child component handling the simulated typeout and line executions
function TerminalDisplay({ command, output }: { command: string; output: string[] }) {
  const [displayedCommand, setDisplayedCommand] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  // Reset and re-type whenever the command changes (user scrolled to a new section)
  useEffect(() => {
    setDisplayedCommand("");
    setShowOutput(false);
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < command.length) {
        setDisplayedCommand((prev) => prev + command.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        // Add a slight delay before executing/printing output lines
        setTimeout(() => setShowOutput(true), 150);
      }
    }, 25); // Typing speed per character

    return () => clearInterval(typingInterval);
  }, [command]);

  return (
    <div className="flex flex-col space-y-3">
      {/* Prompt Line */}
      <div className="flex items-center space-x-2">
        <span className="text-emerald-400 select-none">guest@core:~#</span>
        <span className="text-white font-semibold tracking-wide">
          {displayedCommand}
          <span className="animate-pulse bg-slate-400 ml-0.5 inline-block w-2 h-4 align-middle" />
        </span>
      </div>

      {/* Code/Output Lines Blocks */}
      {showOutput && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-1 text-slate-400 text-xs md:text-sm"
        >
          {output.map((line, idx) => (
            <motion.p 
              key={idx}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }} // Stagger line appearance
              className={line.startsWith('●') ? "text-emerald-400 font-semibold" : ""}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      )}
    </div>
  );
}