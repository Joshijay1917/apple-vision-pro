'use client';

import { useEffect, useState } from 'react';
import { HandTrackingProvider } from '@/context/HandTrackingContext';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isCompatible, setIsCompatible] = useState<boolean | null>(null);
  const [failedRequirements, setFailedRequirements] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);

    const checkCompatibility = async () => {
      const failures: string[] = [];

      // 1. WebGL 2.0 Support (GPU Check)
      let hasWebGL2 = false;
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2");
        hasWebGL2 = !!gl;
      } catch (e) {
        hasWebGL2 = false;
      }

      if (!hasWebGL2) {
        failures.push("WebGL 2.0 Support: Required for high-performance stereoscopic scissor-test rendering.");
      }

      // 2. Processor Core Count (CPU Check)
      const cores = navigator.hardwareConcurrency || 1;
      if (cores < 4) {
        failures.push(`CPU Cores: Found ${cores} logical cores. Minimum 4 physical cores required for background MediaPipe tracking and Three.js multi-threading.`);
      }

      // 3. System RAM Check
      const deviceMemory = (navigator as any).deviceMemory;
      if (deviceMemory !== undefined) {
        if (deviceMemory < 4) {
          failures.push(`System RAM: Found ~${deviceMemory} GB. Minimum 4 GB RAM is required to prevent background MediaPipe Web Worker thread crashes.`);
        }
      }

      // 4. Mobile Camera Hardware checks
      const isMobileDevice = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 1024;
      if (isMobileDevice) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          failures.push("Camera Access: MediaDevices API not supported or disabled under insecure HTTP context.");
        } else {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasVideoInput = devices.some(device => device.kind === 'videoinput');
            if (!hasVideoInput) {
              failures.push("Camera Hardware: No video input devices (cameras) detected on this mobile device.");
            }
          } catch (e) {
            // Don't fail if permissions block enumeration temporarily, fallback gracefully
          }
        }
      }

      if (failures.length > 0) {
        setIsCompatible(false);
        setFailedRequirements(failures);
      } else {
        setIsCompatible(true);
      }
    };

    checkCompatibility();
  }, []);

  if (!mounted || isCompatible === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans select-none">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-[11px] tracking-wider text-neutral-400 uppercase font-medium">Auditing hardware specifications...</p>
        </div>
      </div>
    );
  }

  if (isCompatible === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans select-none">
        <div className="max-w-xl w-full p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          
          <h1 className="text-xl font-bold tracking-wide text-rose-400 text-center">
            This device is not compatable to experince this!
          </h1>
          
          <p className="text-sm text-neutral-400 leading-relaxed text-center">
            Your current hardware configuration does not meet the baseline specifications required to run real-time hand pose models and stereoscopic VR loops smoothly.
          </p>

          <div className="w-full flex flex-col gap-3 bg-white/5 border border-white/15 rounded-2xl p-5 text-left text-xs text-neutral-300">
            <span className="font-semibold text-neutral-200 mb-1 block">Audit Report:</span>
            {failedRequirements.map((req, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <span className="text-rose-500 mt-0.5">✕</span>
                <p className="leading-relaxed">{req}</p>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-white/10 pt-4 flex flex-col gap-2.5 text-[11px] text-neutral-500">
            <div>
              <span className="font-semibold text-neutral-400 block mb-0.5">Minimum Hardware Requirements (Model: 'lite')</span>
              CPU: 64-bit octa-core processor (ARMv8-A architecture) | GPU: WebGL 2.0 support (e.g. Adreno 512, Mali-G52) | RAM: 4 GB System Memory | Camera: 640×480 @ 30 FPS environment back camera.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <HandTrackingProvider>
        {children}
      </HandTrackingProvider>
    </div>
  );
}
