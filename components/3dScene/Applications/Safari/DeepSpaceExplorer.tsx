'use client';

import { useState } from "react";
import { Globe, Rocket, Compass, BarChart3, Radio } from "lucide-react";

export default function DeepSpaceExplorer() {
  const [activeTab, setActiveTab] = useState<"telemetry" | "mission" | "orbit">("telemetry");
  const [enginePower, setEnginePower] = useState(78);

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden relative">
      {/* Immersive Starfield Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/45 via-slate-950 to-black z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-25 z-0 pointer-events-none" />

      {/* Futuristic Immersive Glowing Nebulae */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Internal Navigation Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-slate-900/40 backdrop-blur-md z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Rocket className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-white bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
              ORION EXPLORER
            </h1>
            <p className="text-[10px] text-neutral-400 tracking-widest font-mono">MISSION DEEP-SPACE LXI</p>
          </div>
        </div>

        <div className="flex bg-white/5 border border-white/5 rounded-full p-0.5">
          {(["telemetry", "mission", "orbit"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-slate-950 shadow-md scale-105"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Exploration Panel */}
      <main className="flex-1 p-6 overflow-y-auto z-10 relative flex flex-col gap-6">
        {activeTab === "telemetry" && (
          <div className="grid grid-cols-3 gap-5 animate-fade-in flex-1">
            {/* Left Big Graphic: Rotating Planet */}
            <div className="col-span-2 rounded-2xl bg-white/5 border border-white/5 p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2.5 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase bg-purple-500/20 text-purple-300 border border-purple-500/20">
                  Target Planet
                </span>
                <h3 className="text-base font-bold text-white mt-2">Aetheris-X Prime</h3>
                <p className="text-xs text-neutral-400 mt-0.5 font-mono">Coordinates: Sector 829, Grid 4</p>
              </div>

              {/* Glowing Interactive Rotating Outer-Space Sphere */}
              <div className="flex-1 flex items-center justify-center my-6 relative">
                <div className="absolute w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl animate-pulse" />
                <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-purple-800 via-indigo-900 to-emerald-400 shadow-[inset_-25px_-25px_50px_rgba(0,0,0,0.8),_0_10px_30px_rgba(79,70,229,0.3)] animate-[spin_40s_linear_infinite] relative border border-white/10" />
                {/* Orbital Ring overlay */}
                <div className="absolute w-52 h-10 border-[1.5px] border-white/15 rounded-full rotate-[15deg] pointer-events-none" />
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 font-mono text-[11px]">
                <div>
                  <p className="text-neutral-500 text-[9px] uppercase tracking-wider">Atmosphere</p>
                  <p className="text-white font-medium mt-0.5">Xenon/N₂ (Safe)</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-[9px] uppercase tracking-wider">Surface Gravity</p>
                  <p className="text-white font-medium mt-0.5">0.86g (Comfort)</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-[9px] uppercase tracking-wider">Distance</p>
                  <p className="text-purple-400 font-medium mt-0.5">4.2 Light Years</p>
                </div>
              </div>
            </div>

            {/* Right Panel: Telemetry Controls */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-white/5 border border-white/5 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase font-mono">Engine Output</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{enginePower}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={enginePower}
                  onChange={(e) => setEnginePower(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-white/10 rounded-lg cursor-pointer h-1.5 focus:outline-none mb-4"
                />
                <div className="flex justify-between items-center text-[10px] text-neutral-400 border-t border-white/5 pt-3">
                  <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-purple-400" /> Warp Drive</span>
                  <span className="text-emerald-400 font-semibold uppercase">Nominal</span>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-white/5 border border-white/5 p-5 flex flex-col justify-between font-mono">
                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Diagnostic Signals
                </h4>
                <div className="flex-1 flex flex-col gap-2.5 text-[11px] justify-center">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Shield integrity</span>
                    <span className="text-emerald-400 font-semibold">99.8%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Oxygen generation</span>
                    <span className="text-emerald-400 font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Hyper-jump fuel</span>
                    <span className="text-amber-400 font-semibold">42.7L</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">AI Comms link</span>
                    <span className="text-purple-400 font-semibold">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mission" && (
          <div className="grid grid-cols-2 gap-5 animate-fade-in flex-1">
            <div className="rounded-2xl bg-white/5 border border-white/5 p-5 flex flex-col gap-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                <Globe className="w-4 h-4" /> Mission Logistics
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
                We are actively scouting <strong>Aetheris-X Prime</strong> for resource harvesting and biosphere compatibility. Initial scans show high density of silicon deposits and ambient thermal reserves.
              </p>
              <div className="flex-1 flex items-center justify-center border border-white/5 bg-slate-900/30 rounded-xl p-4">
                <div className="text-center font-mono">
                  <p className="text-[28px] font-extrabold text-white">412</p>
                  <p className="text-[10px] uppercase text-neutral-500 tracking-wider">Days in Deep-Space</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/5 p-5 flex flex-col gap-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                <BarChart3 className="w-4 h-4" /> Telemetry Charts
              </span>
              <div className="flex-1 flex items-end gap-2.5 h-36 bg-slate-950/40 p-4 border border-white/5 rounded-xl">
                <div className="w-full bg-purple-500/30 border border-purple-500/20 rounded-t-md h-[40%] animate-[pulse_3s_infinite]" />
                <div className="w-full bg-indigo-500/40 border border-indigo-500/20 rounded-t-md h-[75%] animate-[pulse_4s_infinite]" />
                <div className="w-full bg-emerald-500/30 border border-emerald-500/20 rounded-t-md h-[55%] animate-[pulse_2s_infinite]" />
                <div className="w-full bg-purple-500/50 border border-purple-500/30 rounded-t-md h-[95%] animate-[pulse_5s_infinite]" />
                <div className="w-full bg-indigo-500/30 border border-indigo-500/20 rounded-t-md h-[60%] animate-[pulse_3s_infinite]" />
              </div>
              <p className="text-[10px] text-neutral-400 font-mono text-center">Spectral frequency distribution over orbital sweeps.</p>
            </div>
          </div>
        )}

        {activeTab === "orbit" && (
          <div className="flex flex-col gap-4 animate-fade-in flex-1 justify-center items-center rounded-2xl bg-white/5 border border-white/5 p-8 relative overflow-hidden">
            <Globe className="w-12 h-12 text-purple-400 animate-spin-slow mb-4" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Planetary Orbit Sync</h3>
            <p className="text-xs text-neutral-400 text-center max-w-[340px] leading-normal font-mono mt-1">
              Synchronizing warp core velocity with target orbital vector. Stabilizing gravitational slingshot factor at <strong>1.48 Mach</strong>.
            </p>
            <div className="w-56 h-1 bg-white/10 rounded-full mt-4 overflow-hidden relative">
              <div className="absolute top-0 left-0 bottom-0 bg-purple-500 w-2/3 rounded-full animate-pulse" />
            </div>
            <span className="text-[9px] font-mono text-purple-400 mt-2 animate-pulse">SYNCING DATALINK...</span>
          </div>
        )}
      </main>
    </div>
  );
}
