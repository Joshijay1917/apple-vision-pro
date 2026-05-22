// app/hdri-demo/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, OrbitControls } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import AppIcon from '@/components/AppIcon';
import { CirclePlay, Mountain, Users } from 'lucide-react';
import Scene from '@/components/Scene';

export default function HdriDemoPage() {
  const [mode, setMode] = useState<'2d' | '3d'>('3d');
  const router = useRouter()

  return (
    <main className="relative min-h-screen w-full font-sans bg-neutral-900 text-white overflow-hidden">

      {/* -------------------------------------------------------------
          OPTION 1: THE 2D STATIC BACKGROUND VIEW
         ------------------------------------------------------------- */}
      {mode === '2d' && (
        <div className="absolute inset-0 z-0 transition-opacity duration-500">
          <Image
            src="/hdri.jpg"
            alt="Flat 2D Mountain Panorama"
            fill
            priority
            className="object-cover object-right brightness-90 scale-105" // Changed object-center to object-right
          />
          {/* Visual Indicator of Flat Layout */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
        </div>
      )}

      {/* -------------------------------------------------------------
          OPTION 2: THE 3D INTERACTIVE ENVIRONMENT VIEW
         ------------------------------------------------------------- */}
      {mode === '3d' && (
        <Scene />
        //         <div className="absolute inset-0 z-0 bg-neutral-950 transition-opacity duration-500">
        //       {/* 1. Note the camera position. It is close to [0,0,0] looking down the negative Z-axis */}
        //       <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        //         <ambientLight intensity={1.5} />

        //         <Environment 
        //           files="/hdri-demo.jpg"
        //           background 
        //         />

        //         {/* 2. The Floating Screen Mesh */}
        //         <mesh position={[0, 0, -4]}>

        //         {/* transform attribute makes the HTML bend and rotate with the 3D scene */}
        //         <Html
        //   position={[0, 0, -3.0]}
        //   transform
        //   distanceFactor={4.5} // Adjust this factor to change the overall size in your 3D scene
        // >
        //   {/* Main layout wrapper containing the side dock and the main app area */}
        //   <div className="flex items-center gap-10 font-sans select-none pointer-events-auto">

        //     {/* ================= LEFT VERTICAL DOCK ================= */}
        //     <div className="flex flex-col gap-5 p-3 rounded-full bg-gray-900/70 backdrop-blur-2xl border border-white/10 shadow-xl">
        //       {/* Dock Item 1 */}
        //       <button className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30 active:scale-95">
        //         <span className="text-white text-xl"><CirclePlay /></span>
        //       </button>
        //       {/* Dock Item 2 */}
        //       <button className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30 active:scale-95">
        //         <span className="text-white text-xl"><Users /></span>
        //       </button>
        //       {/* Dock Item 3 */}
        //       <button className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30 active:scale-95">
        //         <span className="text-white text-xl"><Mountain /></span>
        //       </button>
        //     </div>

        //     {/* ================= MAIN INTERFACE AREA ================= */}
        //     <div className="flex flex-col items-center gap-10">

        //       {/* Staggered Grid Configuration */}
        //       <div className="flex flex-col gap-8 items-center">

        //         {/* ROW 1: 4 Items */}
        //         <div className="flex gap-8 justify-center">
        //           <AppIcon label="TV" src="/icons/tv.png" />
        //           <AppIcon label="Music" src="/icons/Music.png" />
        //           <AppIcon label="Mindfulness" src="/icons/Mindfulness.png" />
        //           <AppIcon label="Settings" src="/icons/settings.png" />
        //         </div>

        //         {/* ROW 2: 5 Items */}
        //         <div className="flex gap-8 justify-center">
        //           <AppIcon label="Freeform" src="/icons/freeform.png" />
        //           <AppIcon label="Safari" src="/icons/safari.png" />
        //           <AppIcon label="Photos" src="/icons/photos.png" />
        //           <AppIcon label="Key notes" src="/icons/Keynotes.png" />
        //           <AppIcon label="App Store" src="/icons/appstore.png" />
        //         </div>

        //         {/* ROW 3: 4 Items */}
        //         <div className="flex gap-8 justify-center">
        //           <AppIcon label="Mail" src="/icons/mail.png" />
        //           <AppIcon label="Messages" src="/icons/messages.png" />
        //           <AppIcon label="Notes" src="/icons/notes.png" />
        //           <AppIcon label="More Apps" src="/icons/apps.png" />
        //         </div>

        //       </div>

        //       {/* ================= PAGINATION DOTS ================= */}
        //       <div className="flex gap-2 justify-center items-center">
        //         <div className="w-2 h-2 rounded-full bg-white opacity-100" />
        //         <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
        //         <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
        //         <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
        //         <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
        //         <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
        //       </div>

        //     </div>
        //   </div>
        // </Html>
        //         </mesh>

        //         <OrbitControls 
        //           enableZoom={false} 
        //           enablePan={false} 
        //           rotateSpeed={-0.4} 
        //         />
        //       </Canvas>
        //     </div>
      )}

      {/* -------------------------------------------------------------
          UI OVERLAY & COMPARISON DASHBOARD
         ------------------------------------------------------------- */}
      <div className="relative z-10 flex flex-col justify-between p-6 md:p-12 min-h-screen pointer-events-none">

        <div className='flex min-w-screen gap-10'>
          {/* Header Block */}
          {/* <header className="max-w-xl bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 pointer-events-auto select-none">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Next.js Implementation Comparison</span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">HDRI Background Architecture</h1>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            Toggle between methods to contrast layout techniques, system performance footprint, and view interactivity.
          </p>
        </header>

        <section className="my-auto w-content bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-white/10 pointer-events-auto shadow-2xl select-none">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">Explore other effects</h1>
        <div className='flex gap-4 w-full'>
          <button onClick={() => router.push('/effect1')} className='bg-orange-900/45 my-2 p-2 rounded-2xl cursor-pointer'>Effect 1</button>
          <button onClick={() => router.push('/effect2')} className='bg-green-900/45 my-2 p-2 rounded-2xl cursor-pointer'>Effect 2</button>
          <button onClick={() => router.push('/effect3')} className='bg-yellow-900/45 my-2 p-2 rounded-2xl cursor-pointer'>Effect 3</button>
          <button onClick={() => router.push('/effect4')} className='bg-red-900/45 my-2 p-2 rounded-2xl cursor-pointer'>Effect 4</button>
          <button onClick={() => router.push('/effect5')} className='bg-red-900/45 my-2 p-2 rounded-2xl cursor-pointer'>Effect 5</button>
          <button onClick={() => router.push('/effect6')} className='bg-red-900/45 my-2 p-2 rounded-2xl cursor-pointer'>Effect 6</button>
          <button onClick={() => router.push('/effect7')} className='bg-red-900/45 my-2 p-2 rounded-2xl cursor-pointer'>Effect 7</button>
        </div>
        </section> */}
        </div>

        {/* Dynamic Spec Metric Card */}
        {/* <section className="my-auto max-w-md bg-black/60 backdrop-blur-lg p-6 rounded-2xl border border-white/10 pointer-events-auto shadow-2xl select-none">
          <h2 className="text-lg font-bold text-white mb-3">
            Active Mode: {mode === '2d' ? '📷 Static 2D Texture' : '🕹️ Interactive 3D Sphere'}
          </h2>
          
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="pb-2">Metric Spec</th>
                <th className="pb-2">Value / Status</th>
              </tr>
            </thead>
            <tbody>
              {mode === '2d' ? (
                <>
                  <tr><td className="py-2 font-medium">DOM Node Type</td><td className="py-2 text-amber-400">Standard HTML &lt;img&gt;</td></tr>
                  <tr><td className="py-2 font-medium">Interactivity</td><td className="py-2 text-neutral-400">None (Fixed orientation)</td></tr>
                  <tr><td className="py-2 font-medium">File Constraint</td><td className="py-2 text-emerald-400">Web-optimised (.webp/.jpg)</td></tr>
                  <tr><td className="py-2 font-medium">CPU/GPU Load</td><td className="py-2 text-emerald-400">Extremely Low (Default layout)</td></tr>
                </>
              ) : (
                <>
                  <tr><td className="py-2 font-medium">DOM Node Type</td><td className="py-2 text-sky-400">HTML5 WebGL &lt;canvas&gt;</td></tr>
                  <tr><td className="py-2 font-medium">Interactivity</td><td className="py-2 text-sky-400">360° Drag-to-Look Experience</td></tr>
                  <tr><td className="py-2 font-medium">File Constraint</td><td className="py-2 text-amber-400">True .hdr Equirectangular Radiance</td></tr>
                  <tr><td className="py-2 font-medium">CPU/GPU Load</td><td className="py-2 text-amber-400">Moderate (Continuous rendering loop)</td></tr>
                </>
              )}
            </tbody>
          </table>
        </section> */}

        {/* Mode Switcher Buttons */}
        <footer className="w-full flex justify-center gap-4 mt-6 pointer-events-auto">
          <button
            onClick={() => setMode('2d')}
            className={`px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg ${mode === '2d'
              ? 'bg-white text-black scale-105 shadow-white/10'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
          >
            Show Option 1: 2D CSS Image
          </button>
          <button
            onClick={() => setMode('3d')}
            className={`px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg ${mode === '3d'
              ? 'bg-emerald-500 text-white scale-105 shadow-emerald-500/20'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
          >
            Show Option 2: 3D Three.js
          </button>
        </footer>

      </div>
    </main>
  );
}
