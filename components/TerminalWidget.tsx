'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalWidgetProps {
  currentSection: number;
}

const SECTION_LOGS: Record<number, string[]> = {
  0: [
    'systemctl status apex-horizon.service',
    '● apex-horizon.service - Apex Core Daemon',
    '   Loaded: loaded (/etc/systemd/system/apex-horizon.service; enabled)',
    '   Active: active (running) since Fri 2026-05-15',
    '   Main PID: 1917 (node)',
    '   Tasks: 12 (limit: 4915)',
    'Ready for input...'
  ],
  1: [
    'npx apex diagnostics --analyze-metrics',
    '[info] Fetching global infrastructure status...',
    '[ok]   Latency: 14ms (Rajkot Edge Engine)',
    '[ok]   Zero-Knowledge Pipeline: Secure',
    '[warn] Local agent memory optimization recommended.',
    'Render complete.'
  ],
  2: [
    'cat ./case-studies/enterprise-sync.md',
    '# Case Study: Smart Stationery Inventory System',
    '- Client: Wholesale Distributor Architecture',
    '- Relational Layer: PostgreSQL via Prisma Migrations',
    '- Automation Matrix: Active WhatsApp Automated Agents',
    'Done.'
  ]
};

export default function TerminalWidget({ currentSection }: TerminalWidgetProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    const logs = SECTION_LOGS[currentSection] || [];
    setVisibleLines([]); // Reset terminal on section shift

    // Progressively print lines to mimic execution
    logs.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, index * 250); // Delay between each log line popping in
    });
  }, [currentSection]);

  return (
    <div className="w-full max-w-lg font-mono text-xs rounded-lg border border-white/10 bg-black/80 backdrop-blur-md shadow-2xl overflow-hidden text-emerald-400">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/60 border-b border-white/5 select-none">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
          <span className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20" />
        </div>
        <span className="text-gray-500 text-[10px] tracking-wider">APEX_CORE_TERMINAL</span>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Terminal Body */}
      <div className="p-5 h-64 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-neutral-800">
        <AnimatePresence>
          {visibleLines.map((line, idx) => {
            const isCommand = line.startsWith('systemctl') || line.startsWith('npx') || line.startsWith('cat');
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={isCommand ? 'text-white font-medium before:content-[">_"] before:text-neutral-500 before:mr-1.5' : 'text-neutral-400'}
              >
                {line}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
          className="inline-block w-2 h-4 bg-emerald-400 relative top-0.5 ml-0.5"
        />
      </div>
    </div>
  );
}