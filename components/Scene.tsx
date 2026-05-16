import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Html } from "@react-three/drei";
import AppIcon from "./AppIcon";
import { CirclePlay, Mountain, Users } from "lucide-react";
import * as THREE from 'three'
import { useHandTracking } from "../context/HandTrackingContext";
import MainScene from "./3dScene/MainScene";
import { HandVisualizer } from "./3dScene/HandVisulizer";

export default function Scene() {
  const [hasStarted, setHasStarted] = useState(false);
  const { hands, isLoaded, error } = useHandTracking();
  const [status, setStatus] = useState("Initializing...");

  function FadingEnvironment({ files }: { files: any }) {
    // Lerp speed: higher = faster fade, lower = slower fade
    const fadeSpeed = 0.03;

    useFrame((state, delta) => {
      const scene = state.scene;

      // Initialize backgroundIntensity if not set
      if (scene.backgroundIntensity === undefined) {
        scene.backgroundIntensity = 0;
      }

      // Only update if we haven't reached the target to save GPU cycles
      if (scene.backgroundIntensity < 0.99) {
        scene.backgroundIntensity = THREE.MathUtils.lerp(
          scene.backgroundIntensity,
          1,
          fadeSpeed
        );
      } else if (scene.backgroundIntensity !== 1) {
        scene.backgroundIntensity = 1;
      }
    });

    return <Environment files={files} background />;
  }

  return (
    // The outermost container stays pure black initially, or updates when started
    <div className="absolute inset-0 z-0 bg-black transition-colors duration-1000">
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[0, 0, 1]} intensity={2} />

        {/* 1. HDRI ENVIRONMENT: Only renders when started so it fades in naturally */}
        {hasStarted && (
          <FadingEnvironment
            files="/hdri.jpg"
          />
        )}

        {/* 2. THE FLOATING INTERFACE */}
        <Html
          position={[0, 0, -4]}
          transform
          distanceFactor={2.5}
        >
          {/* Global wrapper with a smooth CSS opacity fade transition */}
          <div className="transition-opacity duration-1000 ease-in-out">

            {/* ================= INTRO WELCOME PANEL ================= */}
            {!hasStarted ? (
              <div className="w-80 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center text-white font-sans flex flex-col items-center gap-6 animate-fade-in">
                <h1 className="text-2xl font-semibold tracking-wide text-white/90">
                  Apple Vision Pro
                </h1>

                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-neutral-400">
                    {isLoaded ? "🟢 Tracking Ready" : error ? `🔴 Error: ${error}` : "⏳ Loading AI Model..."}
                  </p>

                  {isLoaded && (
                    <button
                      onClick={() => setHasStarted(true)}
                      className="w-full py-3.5 px-6 rounded-full bg-white text-black font-medium tracking-wide text-sm shadow-lg hover:bg-white/90 active:scale-95 transition-all duration-200"
                    >
                      Let's Start
                    </button>
                  )}
                </div>
              </div>
            ) : <MainScene />
            }

          </div>
        </Html>

        <HandVisualizer />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.4}
        />
      </Canvas>
    </div>
  );
}