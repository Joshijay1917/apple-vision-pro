'use client';

import React, { createContext, useContext, useState } from 'react';

export interface BrowserInstance {
  id: string;
  url: string;
  position: [number, number, number];
  scale: [number, number, number];
}

interface ApplicationContextType {
  browsers: BrowserInstance[];
  focusedBrowserId: string | null;
  spawnBrowser: (url?: string) => void;
  closeBrowser: (id: string) => void;
  setFocusedBrowserId: (id: string | null) => void;
  updateBrowserURL: (id: string, url: string) => void;
}

export const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [browsers, setBrowsers] = useState<BrowserInstance[]>([]);
  const [focusedBrowserId, setFocusedBrowserId] = useState<string | null>(null);

  const spawnBrowser = (url: string = "home") => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Stagger layout coordinates so browsers don't stack perfectly
    const count = browsers.length;
    const offsetX = (count % 3 - 1) * 0.45; // Shifts between left, center, right
    const offsetY = Math.floor(count / 3) * 0.15 + (count % 3) * 0.05; // Slightly elevated
    const offsetZ = -3.2 - (count % 2) * 0.15; // Alternating depth to prevent z-fighting
    
    const newBrowser: BrowserInstance = {
      id,
      url,
      position: [offsetX, offsetY, offsetZ],
      scale: [1, 1, 1]
    };
    
    setBrowsers(prev => [...prev, newBrowser]);
    setFocusedBrowserId(id); // Focus new window immediately
  };

  const closeBrowser = (id: string) => {
    setBrowsers(prev => prev.filter(b => b.id !== id));
    setFocusedBrowserId(prev => (prev === id ? null : prev));
  };

  const updateBrowserURL = (id: string, url: string) => {
    setBrowsers(prev => prev.map(b => b.id === id ? { ...b, url } : b));
  };

  return (
    <ApplicationContext.Provider value={{
      browsers,
      focusedBrowserId,
      spawnBrowser,
      closeBrowser,
      setFocusedBrowserId,
      updateBrowserURL
    }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}
