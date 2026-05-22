import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { createPortal } from "react-dom";
import { Environment, Html, PointerLockControls } from "@react-three/drei";
import * as THREE from 'three'
import { useHandTracking } from "@/context/HandTrackingContext";
import { useScene } from "@/context/SceneContext";
import MainScene from "./3dScene/MainScene";
import { HandVisualizer } from "./3dScene/HandVisulizer";
import SpatialCreator from "./3dScene/Applications/SpatialCreator/SpatialCreator";
import { useApplication } from "@/context/ApplicationContext";
import SafariBrowser from "./3dScene/Applications/Safari/SafariBrowser";
import { StereoRenderer } from "./3dScene/StereoRenderer";
import { DeviceOrientationController } from "./3dScene/DeviceOrientationController";


export default function Scene() {
  const [hasStarted, setHasStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleCanvasClick = (e: MouseEvent) => {
      // Only lock pointer if it is a genuine, trusted user gesture click
      if (e.isTrusted) {
        const canvas = document.querySelector('canvas');
        if (canvas && e.target === canvas) {
          canvas.requestPointerLock();
        }
      }
    };
    document.addEventListener('click', handleCanvasClick);
    return () => {
      document.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  const trackingValue = useHandTracking();
  const { hands, isLoaded, error, isMobile } = trackingValue;
  const { activeEnv, setActiveEnv } = useScene();
  const { browsers, spawnBrowser, closeBrowser } = useApplication();
  const [status, setStatus] = useState("Initializing...");
  const [isVRActive, setIsVRActive] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);


  function FadingEnvironment({ files }: { files: any }) {
    const fadeSpeed = 0.03;
    const prevFilesRef = useRef(files);

    useFrame((state) => {
      const scene = state.scene;

      // When files change, reset backgroundIntensity to 0 to trigger a beautiful fade-in!
      if (prevFilesRef.current !== files) {
        scene.backgroundIntensity = 0;
        prevFilesRef.current = files;
      }

      if (scene.backgroundIntensity === undefined) {
        scene.backgroundIntensity = 0;
      }

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
    <div className="absolute inset-0 z-0 bg-black transition-colors duration-1000 select-none touch-none">
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

        {!isMobile && <PointerLockControls selector="#none" />}
        {isMobile && isVRActive && (
          <>
            <StereoRenderer />
            <DeviceOrientationController />
          </>
        )}
        <ambientLight intensity={1.5} />
        <pointLight position={[0, 0, 1]} intensity={2} />

        {/* 1. HDRI ENVIRONMENT: Only renders when started so it fades in naturally */}
        {hasStarted && (
          <FadingEnvironment
            files={activeEnv}
          />
        )}

        {/* 2. THE FLOATING INTERFACE */}
        <Html
          position={[0, 0, -4]}
          transform
          distanceFactor={2.5}
          pointerEvents="auto"
        >
          {/* Global wrapper with a smooth CSS opacity fade transition */}
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            className="transition-opacity duration-1000 ease-in-out"
          >

            {/* ================= INTRO WELCOME PANEL ================= */}
            <div className="flex flex-col justify-center items-center gap-10">
              {!hasStarted && !isMobile && (
                <div className="w-200 p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center text-white font-sans flex justify-between items-center gap-6 animate-fade-in">
                  <h1 className="text-2xl font-semibold tracking-wide text-white/90">
                    Apple Vision Pro
                  </h1>

                  <div className="flex w-1/2 justify-between items-center gap-4">
                    <p className="text-sm text-neutral-400 text-nowrap">
                      {isLoaded ? "🟢 Tracking Ready" : error ? `🔴 Error: ${error}` : "⏳ Loading AI Model..."}
                    </p>

                    {isLoaded && (
                      <button
                        onClick={() => setHasStarted(true)}
                        className="w-full py-3.5 px-6 rounded-full bg-white text-black font-medium tracking-wide text-sm shadow-lg hover:bg-white/50 active:scale-95 transition-all duration-200"
                      >
                        Let's Start
                      </button>
                    )}
                  </div>
                </div>
              )}
              {!isMobile && <div className="animate-fade-in">
                {/* <TestPanel /> */}
                <MainScene
                  activeEnv={activeEnv}
                  setActiveEnv={setActiveEnv}
                  spawnBrowser={spawnBrowser}
                />
              </div>}
            </div>

          </div>
        </Html>

        <HandVisualizer />
        {browsers.map((browser) => (
          <SafariBrowser
            key={browser.id}
            id={browser.id}
            initialUrl={browser.url}
            initialPosition={browser.position}
            initialScale={browser.scale}
            onClose={() => closeBrowser(browser.id)}
          />
        ))}

        {/* Custom Camera Controller replaces OrbitControls for jitter-free pan/parallax */}
      </Canvas>

      {/* Global High-Performance DOM Cursors rendered outside of Canvas to bypass any transformed Drei/Iframe occlusion */}
      {mounted && createPortal(
        <>
          <div
            id="spatial-cursor-0"
            className="fixed w-8 h-8 rounded-full border-[2.5px] border-white bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.45)] transition-all duration-75 ease-out flex items-center justify-center pointer-events-none"
            style={{ opacity: 0, left: 0, top: 0, transform: 'translate3d(0, 0, 0) translate(-50%, -50%)', zIndex: 999999 }}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
          </div>
          <div
            id="spatial-cursor-1"
            className="fixed w-8 h-8 rounded-full border-[2.5px] border-white bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.45)] transition-all duration-75 ease-out flex items-center justify-center pointer-events-none"
            style={{ opacity: 0, left: 0, top: 0, transform: 'translate3d(0, 0, 0) translate(-50%, -50%)', zIndex: 999999 }}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
          </div>
        </>,
        document.body
      )}

      {/* ================= MOBILE ENTER VR MODE OVERLAY ================= */}
      {isMobile && !isVRActive && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-6 text-center font-sans">
          <div className="max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4h-2a2 2 0 0 0-2-2 2 2 0 0 0-2 2H6a4 4 0 0 1-4-4z" />
                <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor" />
                <circle cx="16.5" cy="11.5" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold tracking-wide text-white">
              Cardboard VR Mode
            </h1>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Place your phone into a Cardboard or mobile VR headset to experience a fully immersive 3D stereoscopic space with back-camera hand tracking.
            </p>

            <div className="w-full flex flex-col gap-3 mt-2">
              <button
                onClick={async () => {
                  // 1. Request gyroscope sensor permission
                  const { requestVRSensors } = await import("./3dScene/DeviceOrientationController");
                  const granted = await requestVRSensors();
                  if (!granted) {
                    setPermissionError("Gyroscope/Orientation sensor permission is required for VR head tracking.");
                    return;
                  }

                  // 2. Request Fullscreen to hide mobile browser UI
                  try {
                    const docEl = document.documentElement;
                    if (docEl.requestFullscreen) {
                      await docEl.requestFullscreen();
                    } else if ((docEl as any).webkitRequestFullscreen) {
                      await (docEl as any).webkitRequestFullscreen();
                    } else if ((docEl as any).mozRequestFullScreen) {
                      await (docEl as any).mozRequestFullScreen();
                    } else if ((docEl as any).msRequestFullscreen) {
                      await (docEl as any).msRequestFullscreen();
                    }
                  } catch (fsErr) {
                    console.warn("Fullscreen request failed or was bypassed:", fsErr);
                  }

                  // 3. Activate VR
                  setIsVRActive(true);
                  setHasStarted(true);
                }}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-white font-semibold tracking-wide text-sm shadow-xl shadow-sky-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Enter VR Mode
              </button>

              {permissionError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl py-2 px-3 mt-2">
                  ⚠️ {permissionError}
                </p>
              )}
            </div>

            <p className="text-[11px] text-neutral-500">
              {isLoaded ? "🟢 MediaPipe AI Engine Loaded" : "⏳ Pre-loading hand-tracking models..."}
            </p>
          </div>
        </div>
      )}

      {/* Center-Line Lens Alignment Separator */}
      {isMobile && isVRActive && (
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-black/40 backdrop-blur-sm transform -translate-x-1/2 z-50 pointer-events-none" />
      )}
    </div>
  );
}