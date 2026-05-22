'use client';

import { useState } from "react";
import { useScene } from "@/context/SceneContext";
import { Sun, Hand, Info, X, Sliders } from "lucide-react";

export default function SettingsUI({
  setOpenPanel
}: {
  setOpenPanel: (panel: "main" | "users" | "env" | "SpatialCreator" | "Settings") => void;
}) {
  const [activeTab, setActiveTab] = useState<'display' | 'tracking' | 'about'>('display');
  const {
    ambientIntensity,
    setAmbientIntensity,
    pointIntensity,
    setPointIntensity,
    handSkeletonVisible,
    setHandSkeletonVisible
  } = useScene();

  return (
    <div className="flex w-[900px] h-[680px] rounded-[28px] bg-gray-950/80 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in pointer-events-auto font-sans text-white">

      {/* LEFT SIDEBAR — wider for bigger tap targets */}
      <div className="w-[200px] bg-white/5 border-r border-white/10 p-5 flex flex-col gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 px-2 pb-4 mb-2 border-b border-white/10">
            <span className="text-sky-400"><Sliders size={18} /></span>
            <span className="text-sm font-bold uppercase tracking-wider text-white/90">Settings</span>
          </div>

          {/* TAB: Display & Lights */}
          <button
            onClick={() => setActiveTab('display')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 ${activeTab === 'display'
              ? 'bg-white/15 text-white shadow-md'
              : 'text-white/60 hover:bg-white/8 hover:text-white'
            }`}
          >
            <Sun size={18} />
            <span>Display & Light</span>
          </button>

          {/* TAB: Hand Tracking */}
          <button
            onClick={() => setActiveTab('tracking')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 ${activeTab === 'tracking'
              ? 'bg-white/15 text-white shadow-md'
              : 'text-white/60 hover:bg-white/8 hover:text-white'
            }`}
          >
            <Hand size={18} />
            <span>Hand Tracking</span>
          </button>

          {/* TAB: About */}
          <button
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 ${activeTab === 'about'
              ? 'bg-white/15 text-white shadow-md'
              : 'text-white/60 hover:bg-white/8 hover:text-white'
            }`}
          >
            <Info size={18} />
            <span>About OS</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="px-2 text-[10px] text-white/35 font-medium tracking-wide">
          Spatial OS v1.0.0
        </div>
      </div>

      {/* RIGHT CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-0 bg-transparent">

        {/* Workspace Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/15">
          <span className="text-base font-semibold tracking-wider text-white">
            {activeTab === 'display' && "Display & Lighting"}
            {activeTab === 'tracking' && "Hand Gesture Settings"}
            {activeTab === 'about' && "About Spatial OS"}
          </span>
          {/* Close button — larger hit area */}
          <button
            onClick={() => setOpenPanel("main")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-90 text-white/80 transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 p-7 overflow-y-auto min-h-0 flex flex-col gap-6 text-left">

          {/* TAB CONTENTS: DISPLAY */}
          {activeTab === 'display' && (
            <div className="flex flex-col gap-6 animate-fade-in">

              {/* Control 1: Ambient Light Intensity */}
              <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white/80">Ambient Light Intensity</span>
                  <span className="text-sky-400 font-bold text-sm bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-400/15 min-w-[52px] text-center tabular-nums">
                    {ambientIntensity.toFixed(1)}x
                  </span>
                </div>

                {/* Visual fill bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-200"
                    style={{ width: `${((ambientIntensity - 0.2) / (3.0 - 0.2)) * 100}%` }}
                  />
                </div>

                {/* Preset + step buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-white/35 mr-1">Preset:</span>
                  {[0.5, 1.0, 1.5, 2.0, 2.5].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmbientIntensity(preset)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-90 border ${
                        Math.abs(ambientIntensity - preset) < 0.05
                          ? 'bg-sky-500/35 border-sky-400/50 text-sky-200 shadow-sm'
                          : 'bg-white/8 border-white/12 text-white/60 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                  <div className="w-px h-6 bg-white/15 mx-1" />
                  <button
                    onClick={() => setAmbientIntensity(Math.max(0.2, parseFloat((ambientIntensity - 0.1).toFixed(1))))}
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white font-bold text-lg transition-all duration-150 border border-white/12"
                  >
                    −
                  </button>
                  <button
                    onClick={() => setAmbientIntensity(Math.min(3.0, parseFloat((ambientIntensity + 0.1).toFixed(1))))}
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white font-bold text-lg transition-all duration-150 border border-white/12"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Control 2: Point Light Intensity */}
              <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white/80">Point Light Intensity</span>
                  <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-400/15 min-w-[52px] text-center tabular-nums">
                    {pointIntensity.toFixed(1)}x
                  </span>
                </div>

                {/* Visual fill bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-200"
                    style={{ width: `${(pointIntensity / 4.0) * 100}%` }}
                  />
                </div>

                {/* Preset + step buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-white/35 mr-1">Preset:</span>
                  {[0.0, 1.0, 2.0, 3.0, 4.0].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setPointIntensity(preset)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-90 border ${
                        Math.abs(pointIntensity - preset) < 0.05
                          ? 'bg-emerald-500/35 border-emerald-400/50 text-emerald-200 shadow-sm'
                          : 'bg-white/8 border-white/12 text-white/60 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                  <div className="w-px h-6 bg-white/15 mx-1" />
                  <button
                    onClick={() => setPointIntensity(Math.max(0.0, parseFloat((pointIntensity - 0.1).toFixed(1))))}
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white font-bold text-lg transition-all duration-150 border border-white/12"
                  >
                    −
                  </button>
                  <button
                    onClick={() => setPointIntensity(Math.min(4.0, parseFloat((pointIntensity + 0.1).toFixed(1))))}
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white font-bold text-lg transition-all duration-150 border border-white/12"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENTS: TRACKING */}
          {activeTab === 'tracking' && (
            <div className="flex flex-col gap-5 animate-fade-in">

              {/* Toggle: Hand Skeleton */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 p-5 rounded-2xl gap-6">
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-sm font-semibold text-white/90">Display Hand Skeleton</span>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Show real-time bone segments and joint spheres estimated by MediaPipe AI.
                  </p>
                </div>
                {/* Large toggle — easy to pinch-click */}
                <button
                  onClick={() => setHandSkeletonVisible(!handSkeletonVisible)}
                  className={`w-16 h-9 rounded-full px-1 transition-all duration-300 border border-white/10 flex items-center shadow-inner cursor-pointer shrink-0 ${
                    handSkeletonVisible ? 'bg-sky-500/80 justify-end' : 'bg-white/10 justify-start'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.4)]" />
                </button>
              </div>

              {/* Diagnostics */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">Tracking Diagnostics</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 text-[10px] uppercase tracking-wide">Status</span>
                    <span className="text-emerald-400 font-semibold text-sm">🟢 ACTIVE</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 text-[10px] uppercase tracking-wide">AI Latency</span>
                    <span className="text-white/80 font-mono text-sm">~16ms</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENTS: ABOUT */}
          {activeTab === 'about' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-3xl">✨</span>
                </div>
                <div className="flex flex-col text-left gap-1">
                  <span className="text-base font-semibold text-white">Spatial OS</span>
                  <span className="text-xs text-white/40 font-medium">Concept visionOS for Browser</span>
                </div>
              </div>

              <div className="flex flex-col gap-0 rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
                <div className="flex justify-between border-b border-white/8 px-5 py-4 text-sm">
                  <span className="text-white/40">Hardware Architecture</span>
                  <span className="text-white/80 font-semibold font-mono text-xs">64-bit WASM Multi-Thread</span>
                </div>
                <div className="flex justify-between border-b border-white/8 px-5 py-4 text-sm">
                  <span className="text-white/40">Graphics Engine</span>
                  <span className="text-white/80 font-semibold text-xs">WebGL 2.0 (Three.js/R3F)</span>
                </div>
                <div className="flex justify-between px-5 py-4 text-sm">
                  <span className="text-white/40">Developer</span>
                  <span className="text-sky-400 font-semibold">Joshi Jay</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
