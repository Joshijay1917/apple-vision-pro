'use client';

import React, { createContext, useContext, useState } from 'react';

interface SceneContextType {
  activeEnv: string;
  setActiveEnv: (env: string) => void;
}

export const SceneContext = createContext<SceneContextType | undefined>(undefined);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [activeEnv, setActiveEnv] = useState<string>("/Environments/hdri1.jpg");

  return (
    <SceneContext.Provider value={{ activeEnv, setActiveEnv }}>
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
