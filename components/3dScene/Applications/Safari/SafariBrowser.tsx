'use client';

import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useHandTracking } from "@/context/HandTrackingContext";
import { useApplication } from "@/context/ApplicationContext";
import SafariHome from "./SafariHome";
import DeepSpaceExplorer from "./DeepSpaceExplorer";
import DuckDuckGoSearch from "./DuckDuckGoSearch";
import { X, ArrowLeft, ArrowRight, RotateCw, Home, Search, Maximize2, Minimize2, ExternalLink } from "lucide-react";

interface SafariBrowserProps {
  id: string;
  initialUrl: string;
  initialPosition: [number, number, number];
  initialScale: [number, number, number];
  onClose: () => void;
}

export default function SafariBrowser({
  id,
  initialUrl,
  initialPosition,
  initialScale,
  onClose
}: SafariBrowserProps) {
  const { handsRef, isMobile } = useHandTracking();
  const { focusedBrowserId, setFocusedBrowserId, updateBrowserURL } = useApplication();

  const groupRef = useRef<THREE.Group>(null);

  // Transform and drag references
  const isDragging = useRef(false);
  const dragSource = useRef<{ type: 'mouse' } | { type: 'hand'; handIndex: number } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const mouseOffset = useRef(new THREE.Vector3());
  const handOffset = useRef(new THREE.Vector3());
  const needsMouseOffsetInit = useRef(false);

  const isClick = useRef(false);
  const isMouseEntered = useRef(false);

  // Two-hand scaling references
  const isTwoHandScaling = useRef(false);
  const initialHandDistance = useRef(0);
  const initialWindowScale = useRef(1);
  const initialPosOffset = useRef(new THREE.Vector3());

  // Local navigation state
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [addressBarText, setAddressBarText] = useState(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync state changes with context URL changes
  useEffect(() => {
    setCurrentUrl(initialUrl);
    setAddressBarText(initialUrl === "home" ? "" : initialUrl === "space-explorer" ? "space://explorer" : initialUrl);
  }, [initialUrl]);

  // Unified Navigation Handler
  const navigateTo = (newUrl: string) => {
    let processedUrl = newUrl;
    if (processedUrl.includes("youtube.com/embed/") && !processedUrl.includes("enablejsapi=1")) {
      processedUrl += processedUrl.includes("?") ? "&enablejsapi=1" : "?enablejsapi=1";
    }

    // Add to history
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(processedUrl);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);

    updateBrowserURL(id, processedUrl);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      updateBrowserURL(id, history[idx]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      updateBrowserURL(id, history[idx]);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let dest = addressBarText.trim();
    if (!dest) return;

    if (dest.toLowerCase() === "space://explorer") {
      navigateTo("space-explorer");
    } else if (!dest.startsWith("http://") && !dest.startsWith("https://") && !dest.includes(".")) {
      navigateTo(`https://duckduckgo.com/?q=${encodeURIComponent(dest)}`);
    } else if (!dest.startsWith("http://") && !dest.startsWith("https://")) {
      navigateTo(`https://` + dest);
    } else {
      navigateTo(dest);
    }
  };

  // Drag and focus interaction triggers
  const handleDragStart = (e?: any) => {
    if (e) e.stopPropagation();
    setFocusedBrowserId(id); // Target window focus

    isDragging.current = true;
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = 'none';
    }

    // Capture hands state
    const hands = handsRef.current;
    let handIndex = -1;
    let handPinchPos = new THREE.Vector3();

    const scaleFactor = 5.5;
    const offsetZ = -1.2;
    const offsetY = -0.5;
    const viewWidth = 2.0;
    const viewHeight = 1.5;

    // Check if a hand is currently performing a pinch
    const leftHand = hands.find((h) => h.handedness === "Left" || h.handedness === "left");
    if (leftHand?.keypoints3D?.[4] && leftHand?.keypoints3D?.[8] && leftHand?.keypoints?.[0]) {
      const screenX = (leftHand.keypoints[0].x / 640) - 0.5;
      const screenY = (leftHand.keypoints[0].y / 480) - 0.5;
      const wOffsetX = (isMobile ? screenX : -screenX) * viewWidth * 2;
      const wOffsetY = -screenY * viewHeight * 2;
      const thumb = leftHand.keypoints3D[4];
      const index = leftHand.keypoints3D[8];
      const thumbVec = new THREE.Vector3((isMobile ? thumb.x : -thumb.x) * scaleFactor + wOffsetX, -thumb.y * scaleFactor + wOffsetY + offsetY, thumb.z * scaleFactor + offsetZ);
      const indexVec = new THREE.Vector3((isMobile ? index.x : -index.x) * scaleFactor + wOffsetX, -index.y * scaleFactor + wOffsetY + offsetY, index.z * scaleFactor + offsetZ);

      if (thumbVec.distanceTo(indexVec) < 0.25) {
        handIndex = 0; // Left
        handPinchPos.addVectors(thumbVec, indexVec).multiplyScalar(0.5);
      }
    }

    if (handIndex === -1) {
      const rightHand = hands.find((h) => h.handedness === "Right" || h.handedness === "right");
      if (rightHand?.keypoints3D?.[4] && rightHand?.keypoints3D?.[8] && rightHand?.keypoints?.[0]) {
        const screenX = (rightHand.keypoints[0].x / 640) - 0.5;
        const screenY = (rightHand.keypoints[0].y / 480) - 0.5;
        const wOffsetX = (isMobile ? screenX : -screenX) * viewWidth * 2;
        const wOffsetY = -screenY * viewHeight * 2;
        const thumb = rightHand.keypoints3D[4];
        const index = rightHand.keypoints3D[8];
        const thumbVec = new THREE.Vector3((isMobile ? thumb.x : -thumb.x) * scaleFactor + wOffsetX, -thumb.y * scaleFactor + wOffsetY + offsetY, thumb.z * scaleFactor + offsetZ);
        const indexVec = new THREE.Vector3((isMobile ? index.x : -index.x) * scaleFactor + wOffsetX, -index.y * scaleFactor + wOffsetY + offsetY, index.z * scaleFactor + offsetZ);

        if (thumbVec.distanceTo(indexVec) < 0.25) {
          handIndex = 1; // Right
          handPinchPos.addVectors(thumbVec, indexVec).multiplyScalar(0.5);
        }
      }
    }

    if (handIndex !== -1 && groupRef.current) {
      dragSource.current = { type: 'hand', handIndex };
      handOffset.current.copy(groupRef.current.position).sub(handPinchPos);
    } else if (groupRef.current) {
      dragSource.current = { type: 'mouse' };
      needsMouseOffsetInit.current = true;
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    dragSource.current = null;
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = 'auto';
    }
  };

  const checkDragState = () => {
    if (isClick.current && isMouseEntered.current) {
      if (!isDragging.current) {
        handleDragStart();
      }
    } else {
      if (isDragging.current) {
        handleDragEnd();
      }
    }
  };

  // Listen for global pointer ups and mouse ups to secure mouse drag releases
  useEffect(() => {
    const handleGlobalRelease = () => {
      isClick.current = false;
      isMouseEntered.current = false;
      checkDragState();
    };
    window.addEventListener('pointerup', handleGlobalRelease);
    window.addEventListener('mouseup', handleGlobalRelease);
    return () => {
      window.removeEventListener('pointerup', handleGlobalRelease);
      window.removeEventListener('mouseup', handleGlobalRelease);
    };
  }, []);

  // Set initial position and scale from props
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...initialPosition);
      groupRef.current.scale.set(...initialScale);
    }
  }, [initialPosition, initialScale]);

  // Main high-performance R3F interaction and physics loop
  useFrame((state) => {
    if (!groupRef.current) return;

    const hands = handsRef.current;

    // --- 1. PRE-ALLOCATED GESTURE COORDINATE CALCULATIONS ---
    let leftPinchPos = new THREE.Vector3();
    let isLeftPinching = false;
    let rightPinchPos = new THREE.Vector3();
    let isRightPinching = false;

    const scaleFactor = 5.5;
    const offsetZ = -1.2;
    const offsetY = -0.5;
    const viewWidth = 2.0;
    const viewHeight = 1.5;

    const leftHand = hands.find((h) => h.handedness === "Left" || h.handedness === "left");
    if (leftHand?.keypoints3D?.[4] && leftHand?.keypoints3D?.[8] && leftHand?.keypoints?.[0]) {
      const screenX = (leftHand.keypoints[0].x / 640) - 0.5;
      const screenY = (leftHand.keypoints[0].y / 480) - 0.5;
      const wOffsetX = (isMobile ? screenX : -screenX) * viewWidth * 2;
      const wOffsetY = -screenY * viewHeight * 2;
      const thumb = leftHand.keypoints3D[4];
      const index = leftHand.keypoints3D[8];
      const thumbVec = new THREE.Vector3((isMobile ? thumb.x : -thumb.x) * scaleFactor + wOffsetX, -thumb.y * scaleFactor + wOffsetY + offsetY, thumb.z * scaleFactor + offsetZ);
      const indexVec = new THREE.Vector3((isMobile ? index.x : -index.x) * scaleFactor + wOffsetX, -index.y * scaleFactor + wOffsetY + offsetY, index.z * scaleFactor + offsetZ);

      isLeftPinching = thumbVec.distanceTo(indexVec) < 0.25;
      leftPinchPos.addVectors(thumbVec, indexVec).multiplyScalar(0.5);
    }

    const rightHand = hands.find((h) => h.handedness === "Right" || h.handedness === "right");
    if (rightHand?.keypoints3D?.[4] && rightHand?.keypoints3D?.[8] && rightHand?.keypoints?.[0]) {
      const screenX = (rightHand.keypoints[0].x / 640) - 0.5;
      const screenY = (rightHand.keypoints[0].y / 480) - 0.5;
      const wOffsetX = (isMobile ? screenX : -screenX) * viewWidth * 2;
      const wOffsetY = -screenY * viewHeight * 2;
      const thumb = rightHand.keypoints3D[4];
      const index = rightHand.keypoints3D[8];
      const thumbVec = new THREE.Vector3((isMobile ? thumb.x : -thumb.x) * scaleFactor + wOffsetX, -thumb.y * scaleFactor + wOffsetY + offsetY, thumb.z * scaleFactor + offsetZ);
      const indexVec = new THREE.Vector3((isMobile ? index.x : -index.x) * scaleFactor + wOffsetX, -index.y * scaleFactor + wOffsetY + offsetY, index.z * scaleFactor + offsetZ);

      isRightPinching = thumbVec.distanceTo(indexVec) < 0.25;
      rightPinchPos.addVectors(thumbVec, indexVec).multiplyScalar(0.5);
    }

    // --- 2. DUAL-HAND PINCH & SCALE CALCULATION ---
    if (isLeftPinching && isRightPinching && focusedBrowserId === id) {
      // Overrides one-handed dragging
      isDragging.current = false;
      dragSource.current = null;
      if (iframeRef.current) {
        iframeRef.current.style.pointerEvents = 'auto';
      }

      if (!isTwoHandScaling.current) {
        isTwoHandScaling.current = true;
        initialHandDistance.current = leftPinchPos.distanceTo(rightPinchPos);
        initialWindowScale.current = groupRef.current.scale.x;

        const handMidpoint = new THREE.Vector3().addVectors(leftPinchPos, rightPinchPos).multiplyScalar(0.5);
        initialPosOffset.current.copy(groupRef.current.position).sub(handMidpoint);
      } else {
        const currentDistance = leftPinchPos.distanceTo(rightPinchPos);
        const scaleMultiplier = currentDistance / Math.max(0.01, initialHandDistance.current);
        const targetScale = initialWindowScale.current * scaleMultiplier;

        // Clamp scale to keep layout usable (between 0.4 and 3.5 times base scale)
        const clampedScale = Math.max(0.4, Math.min(3.5, targetScale));
        groupRef.current.scale.set(clampedScale, clampedScale, clampedScale);

        const handMidpoint = new THREE.Vector3().addVectors(leftPinchPos, rightPinchPos).multiplyScalar(0.5);
        const targetPos = handMidpoint.clone().add(initialPosOffset.current);

        // Premium organic spring dampening effect (lerping position)
        groupRef.current.position.lerp(targetPos, 0.2);
      }
    } else {
      isTwoHandScaling.current = false;

      // --- 3. ONE-HANDED / MOUSE DRAG PHYSICAL CALCULATIONS ---
      if (isDragging.current && dragSource.current) {
        if (dragSource.current.type === 'mouse') {
          // Pixel-perfect 3D unprojection for mouse/trackpad pointer movements
          const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
          vector.unproject(state.camera);
          const dir = vector.sub(state.camera.position).normalize();
          const distance = dir.z !== 0 ? (groupRef.current.position.z - state.camera.position.z) / dir.z : 0;
          const targetPoint = state.camera.position.clone().add(dir.multiplyScalar(distance));

          if (needsMouseOffsetInit.current) {
            mouseOffset.current.copy(groupRef.current.position).sub(targetPoint);
            needsMouseOffsetInit.current = false;
          }

          groupRef.current.position.copy(targetPoint.add(mouseOffset.current));
        } else if (dragSource.current.type === 'hand') {
          // Responsive tracking for virtual hands
          const hIdx = dragSource.current.handIndex;
          const handPinchPos = hIdx === 0 ? leftPinchPos : rightPinchPos;
          const isPinching = hIdx === 0 ? isLeftPinching : isRightPinching;

          if (isPinching) {
            const targetPos = handPinchPos.clone().add(handOffset.current);
            // Smooth lerp to give a premium floating visual feel
            groupRef.current.position.lerp(targetPos, 0.25);
          } else {
            isDragging.current = false;
            dragSource.current = null;
            if (iframeRef.current) {
              iframeRef.current.style.pointerEvents = 'auto';
            }
          }
        }
      }
    }
  });

  const isFocused = focusedBrowserId === id;

  return (
    <group ref={groupRef} name={`browser-${id}`}>
      {/* 3D Browser HTML Overlay */}
      <Html
        transform
        distanceFactor={2.5}
        pointerEvents="auto"
        className="font-sans select-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <div
            onClick={() => setFocusedBrowserId(id)}
            className={`w-[680px] h-[460px] rounded-3xl overflow-hidden bg-gray-950/90 border border-white/10 flex flex-col shadow-2xl transition-all duration-300 pointer-events-auto ${isFocused
              ? "ring-2 ring-sky-500/50 shadow-[0_0_40px_rgba(56,189,248,0.25)] border-sky-400/40"
              : "opacity-90 scale-99 border-white/10"
              } ${isTwoHandScaling.current ? "ring-2 ring-emerald-500/50 shadow-[0_0_40px_rgba(52,211,153,0.25)] border-emerald-400/40" : ""}`}
          >
            {/* ================= HEADER BAR (DRAG BAR) ================= */}
            {!isFullscreen && (
              <div
                className="h-16 bg-gray-900/60 border-b border-white/5 px-4 flex items-center justify-between shrink-0 hover:bg-gray-900/80 transition-colors duration-200 select-none"
              >
                {/* Traffic light and navigation buttons */}
                <div 
                  className="flex items-center gap-2" 
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-rose-500/30 hover:text-rose-400 text-white/50 text-[11px] font-bold transition-all duration-200"
                    title="Close Window"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleBack(); }}
                    disabled={historyIndex === 0}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 active:scale-95"
                    title="Go Back"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleForward(); }}
                    disabled={historyIndex === history.length - 1}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 active:scale-95"
                    title="Go Forward"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Glowing Interactive Address Input Bar */}
                <form
                  onSubmit={handleAddressSubmit}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="flex-1 max-w-[340px] mx-4"
                >
                  <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-2 focus-within:border-sky-500/35 focus-within:bg-white/10 transition-all duration-200">
                    <Search className="w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={addressBarText}
                      onChange={(e) => setAddressBarText(e.target.value)}
                      placeholder="duckduckgo.com"
                      className="bg-transparent text-white text-xs font-medium outline-none w-full placeholder-neutral-500"
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentUrl(prev => prev)}
                      className="text-neutral-400 hover:text-white transition-colors duration-150"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Home and Window Controls */}
                <div 
                  className="flex items-center gap-2" 
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); navigateTo("home"); }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150 active:scale-95"
                    title="Go to Safari Home"
                  >
                    <Home className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentUrl && currentUrl !== "home" && currentUrl !== "space-explorer") {
                        window.open(currentUrl, "_blank");
                      }
                    }}
                    disabled={!currentUrl || currentUrl === "home" || currentUrl === "space-explorer"}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 active:scale-95"
                    title="Open Live Site in New Chrome/Edge Tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150 active:scale-95"
                    title="Expand to Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= MAIN CONTENT AREA ================= */}
            <div className="flex-1 bg-slate-950/95 overflow-hidden relative select-text">
              {isFullscreen && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                  className="absolute top-4 right-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-black/60 hover:bg-black/80 text-white/80 border border-white/10 backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 pointer-events-auto"
                  title="Exit Fullscreen"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              )}
              {currentUrl === "home" ? (
                <SafariHome onNavigate={navigateTo} />
              ) : currentUrl === "space-explorer" ? (
                <DeepSpaceExplorer />
              ) : currentUrl.startsWith("https://duckduckgo.com") || currentUrl.startsWith("https://www.duckduckgo.com") ? (
                <DuckDuckGoSearch url={currentUrl} onNavigate={navigateTo} />
              ) : (
                <iframe
                  ref={iframeRef}
                  src={
                    currentUrl.includes("youtube.com/embed/")
                      ? (() => {
                          let url = currentUrl;
                          if (!url.includes("enablejsapi=1")) {
                            url += (url.includes("?") ? "&enablejsapi=1" : "?enablejsapi=1");
                          }
                          if (!url.includes("origin=")) {
                            const parentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
                            url += `&origin=${encodeURIComponent(parentOrigin)}`;
                          }
                          if (!url.includes("mute=1") && !url.includes("muted=1")) {
                            url += "&mute=1";
                          }
                          return url;
                        })()
                      : currentUrl
                  }
                  className="w-full h-full border-none bg-white pointer-events-auto"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-presentation"
                />
              )}
            </div>
          </div>

          {/* ================= BOTTOM OS HOME DRAG INDICATOR HANDLE ================= */}
          {!isFullscreen && (
            <div className="w-full flex justify-center mt-3 select-none" onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
              <div
                onPointerEnter={() => {
                  isMouseEntered.current = true;
                  checkDragState();
                }}
                onPointerLeave={() => {
                  if (!isDragging.current) {
                    isMouseEntered.current = false;
                    checkDragState();
                  }
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setFocusedBrowserId(id);
                  isClick.current = true;
                  checkDragState();
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  isClick.current = false;
                  isMouseEntered.current = false;
                  checkDragState();
                }}
                onMouseEnter={() => {
                  isMouseEntered.current = true;
                  checkDragState();
                }}
                onMouseLeave={() => {
                  if (!isDragging.current) {
                    isMouseEntered.current = false;
                    checkDragState();
                  }
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setFocusedBrowserId(id);
                  isClick.current = true;
                  checkDragState();
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  isClick.current = false;
                  isMouseEntered.current = false;
                  checkDragState();
                }}
                className="w-[580px] h-16 flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <div className={`w-32 h-2 rounded-full border border-white/5 shadow-lg transition-all duration-300 pointer-events-none hover:scale-x-105 active:scale-x-95 ${isFocused
                  ? "bg-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.5)] scale-x-105 border-sky-400/20"
                  : "bg-white/15"
                  }`} />
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
