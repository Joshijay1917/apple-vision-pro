'use client';

import React, { createContext, useContext, useState } from 'react';

interface SceneContextType {
  activeEnv: string;
  setActiveEnv: (env: string) => void;
  ambientIntensity: number;
  setAmbientIntensity: (val: number) => void;
  pointIntensity: number;
  setPointIntensity: (val: number) => void;
  handSkeletonVisible: boolean;
  setHandSkeletonVisible: (val: boolean) => void;
}

export const SceneContext = createContext<SceneContextType | undefined>(undefined);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [activeEnv, setActiveEnv] = useState<string>("/Environments/hdri1.jpg");
  const [ambientIntensity, setAmbientIntensity] = useState<number>(1.5);
  const [pointIntensity, setPointIntensity] = useState<number>(2.0);
  const [handSkeletonVisible, setHandSkeletonVisible] = useState<boolean>(true);

  return (
    <SceneContext.Provider value={{
      activeEnv,
      setActiveEnv,
      ambientIntensity,
      setAmbientIntensity,
      pointIntensity,
      setPointIntensity,
      handSkeletonVisible,
      setHandSkeletonVisible
    }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}
