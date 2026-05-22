'use client';

import { useState } from "react";
import { Search, Compass, Globe, Compass as CompassIcon, Compass as SpaceIcon, PlaySquare } from "lucide-react";

interface SafariHomeProps {
  onNavigate: (url: string) => void;
}

export default function SafariHome({ onNavigate }: SafariHomeProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    let url = searchInput.trim();
    // Auto-detect standard URLs, otherwise search via DuckDuckGo
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.includes(".")) {
      url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    onNavigate(url);
  };

  const bookmarks = [
    {
      label: "DuckDuckGo",
      desc: "Private Web Search",
      url: "https://duckduckgo.com",
      icon: <Search className="w-6 h-6 text-orange-400" />,
      color: "from-orange-500/20 to-amber-600/10 border-orange-500/30"
    },
    {
      label: "Wikipedia",
      desc: "Free Encyclopedia",
      url: "https://en.m.wikipedia.org",
      icon: <Globe className="w-6 h-6 text-sky-400" />,
      color: "from-sky-500/20 to-indigo-600/10 border-sky-500/30"
    },
    {
      label: "Deep Space Explorer",
      desc: "Immersive Cosmic Sim",
      url: "space-explorer",
      icon: <CompassIcon className="w-6 h-6 text-purple-400 animate-spin-slow" />,
      color: "from-purple-500/20 to-pink-600/10 border-purple-500/30"
    },
    {
      label: "YouTube Player",
      desc: "Relaxing Lo-Fi Stream",
      url: "https://www.youtube.com/embed/lP157TMn-x8", // Relaxing Lo-Fi / Synthwave ambient
      icon: <PlaySquare className="w-6 h-6 text-rose-400" />,
      color: "from-rose-500/20 to-red-600/10 border-rose-500/30"
    }
  ];

  return (
    <div className="w-full h-full bg-slate-900/90 text-slate-100 flex flex-col justify-center items-center p-8 font-sans select-none overflow-hidden relative">
      {/* Decorative Blur Backing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-[480px] w-full flex flex-col items-center gap-8 z-10 relative">
        {/* Glowing Apple Safari Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-500 flex items-center justify-center shadow-2xl border border-white/20 animate-pulse relative">
            <Compass className="w-9 h-9 text-white rotate-[45deg]" />
          </div>
          <h2 className="text-xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Safari Spatial
          </h2>
          <p className="text-xs text-neutral-400 font-medium">Explore the infinite web in 3D</p>
        </div>

        {/* Elegant Address/Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-white/30 focus-within:bg-white/10 focus-within:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search or enter website URL..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-transparent text-white text-sm outline-none w-full placeholder-neutral-500 font-medium"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-white text-slate-950 text-xs font-bold uppercase hover:bg-white/80 active:scale-95 transition-all duration-150"
            >
              Go
            </button>
          </div>
        </form>

        {/* Spatial Bookmarks Grid */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-1 font-mono">
            Spatial Computing Bookmarks
          </span>
          <div className="grid grid-cols-2 gap-3.5">
            {bookmarks.map((bookmark) => (
              <button
                key={bookmark.label}
                onClick={() => onNavigate(bookmark.url)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-tr border text-left hover:scale-[1.03] active:scale-98 transition-all duration-200 pointer-events-auto ${bookmark.color}`}
              >
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 shadow-inner shrink-0">
                  {bookmark.icon}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white leading-normal truncate">{bookmark.label}</h4>
                  <p className="text-[9px] text-neutral-400 mt-0.5 font-medium truncate">{bookmark.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Premium Sandbox Notice/Tips bar */}
        <div className="w-full mt-2 py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-[10px] text-neutral-400 leading-normal font-mono flex items-start gap-2.5">
          <span className="text-sky-400 shrink-0 font-bold">✨ Tip:</span>
          <span>
            Many major websites block loading in third-party iframes. For the best 3D multitasking experience, use the custom-designed bookmarks above!
          </span>
        </div>
      </div>
    </div>
  );
}
