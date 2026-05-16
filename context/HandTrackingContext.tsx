'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface HandTrackingContextType {
  hands: any[];
  handsRef: React.MutableRefObject<any[]>; // For high-performance access in useFrame
  isLoaded: boolean;
  stream: MediaStream | null;
  error: string | null;
}

const HandTrackingContext = createContext<HandTrackingContextType | undefined>(undefined);

export function HandTrackingProvider({ children }: { children: React.ReactNode }) {
  const [hands, setHands] = useState<any[]>([]);
  const isLoadedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handsRef = useRef<any[]>([]);
  const detectorRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    async function init() {
      try {
        const waitForGlobals = async () => {
          let attempts = 0;
          while (attempts < 50) {
            if ((window as any).tf && (window as any).handPoseDetection) return true;
            await new Promise(r => setTimeout(r, 100));
            attempts++;
          }
          return false;
        };

        const ready = await waitForGlobals();
        if (!ready) throw new Error("AI Libraries failed to load.");

        const tf = (window as any).tf;
        const handPoseDetection = (window as any).handPoseDetection;

        await tf.setBackend('webgl');
        await tf.ready();
        
        detectorRef.current = await handPoseDetection.createDetector(
          handPoseDetection.SupportedModels.MediaPipeHands,
          { 
            runtime: 'mediapipe', 
            modelType: 'lite', 
            maxHands: 2,
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
          }
        );

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        streamRef.current = mediaStream;
        setStream(mediaStream);

        const video = document.createElement('video');
        video.srcObject = mediaStream;
        video.muted = true;
        video.playsInline = true;
        video.width = 640;
        video.height = 480;
        await video.play();
        videoRef.current = video;

        isLoadedRef.current = true;
        setIsLoaded(true);
        requestRef.current = requestAnimationFrame(detectLoop);
      } catch (err: any) {
        setError(err.message || 'Initialization failed');
      }
    }

    init();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (detectorRef.current) detectorRef.current.dispose();
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const detectLoop = async (time: number) => {
    // Throttle to ~30 FPS to leave room for rendering
    if (time - lastTimeRef.current > 33) {
      if (detectorRef.current && videoRef.current && videoRef.current.readyState >= 2) {
        try {
          const detectedHands = await detectorRef.current.estimateHands(videoRef.current);
          handsRef.current = detectedHands;
          
          if (detectedHands.length > 0 && Math.random() < 0.01) {
            console.log('Hand Detected:', detectedHands[0].keypoints3D[0]);
          }
          
          // Only update React state occasionally for UI (e.g., 10 FPS), not every frame
          if (time - lastTimeRef.current > 100) {
            setHands(detectedHands);
          }
        } catch (err) {
          // console.error('Detection error:', err);
        }
      }
      lastTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(detectLoop);
  };

  return (
    <HandTrackingContext.Provider value={{ hands, handsRef, isLoaded, stream, error }}>
      {children}
    </HandTrackingContext.Provider>
  );
}

export function useHandTracking() {
  const context = useContext(HandTrackingContext);
  if (context === undefined) {
    throw new Error('useHandTracking must be used within a HandTrackingProvider');
  }
  return context;
}
