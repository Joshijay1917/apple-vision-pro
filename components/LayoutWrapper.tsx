'use client';

import { usePathname } from 'next/navigation';
import { HandTrackingProvider } from '@/context/HandTrackingContext';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobileRoute = pathname === '/mobile';

  if (isMobileRoute) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        {children}
      </div>
    );
  }

  return (
    <>
      {/* MOBILE BLOCKER SCREEN: Shown on mobile, hidden on desktop (lg and up) */}
      <div className="flex lg:hidden fixed inset-0 z-50 bg-slate-950 flex-col items-center justify-center p-6 text-center select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
        
        <div className="relative max-w-sm space-y-4 font-mono">
          <div className="text-rose-500 text-4xl mb-2 animate-pulse">⚠️</div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">
            Environment Conflict
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            This terminal matrix requires a wider viewport aspect ratio to initialize properly. 
          </p>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-emerald-400">
            Please open this website in a laptop or desktop.
          </div>
        </div>
      </div>

      {/* MAIN APP CONTENT: Hidden on mobile, flex layout on desktop (lg and up) */}
      <div className="hidden lg:flex lg:flex-col lg:min-h-screen w-full">
        <HandTrackingProvider>
          {children}
        </HandTrackingProvider>
      </div>
    </>
  );
}
