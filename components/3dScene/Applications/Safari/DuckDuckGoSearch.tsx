'use client';

import { useState, useEffect } from "react";
import { Search, Globe, Shield, ExternalLink, ArrowRight, PlayCircle, BookOpen, Compass } from "lucide-react";

interface DuckDuckGoSearchProps {
  url: string;
  onNavigate: (url: string) => void;
}

export default function DuckDuckGoSearch({ url, onNavigate }: DuckDuckGoSearchProps) {
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Parse query parameter from URL
  useEffect(() => {
    try {
      const urlObj = new URL(url);
      const q = urlObj.searchParams.get("q") || "";
      setQuery(q);
      setSearchInput(q);
    } catch (e) {
      setQuery("");
      setSearchInput("");
    }
  }, [url]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onNavigate(`https://duckduckgo.com/?q=${encodeURIComponent(searchInput.trim())}`);
  };

  // Generate premium curated search results based on the search query
  const getSearchResults = (q: string) => {
    const norm = q.toLowerCase().trim();

    if (!norm) return [];

    const results = [];

    // 1. YouTube specific results
    if (norm.includes("youtube") || norm.includes("video") || norm.includes("music") || norm.includes("lofi")) {
      results.push({
        title: "YouTube Player - Immersive Lo-Fi & Synthwave",
        snippet: "Experience a beautifully integrated relaxing Lo-Fi Synthwave ambient audio player. Stream uninterrupted and spatialized inside your three-dimensional workspace.",
        url: "https://www.youtube.com/embed/lP157TMn-x8",
        isInternal: true,
        type: "video"
      });
    }

    // 2. Space / Explorer specific results
    if (norm.includes("space") || norm.includes("explorer") || norm.includes("deep space") || norm.includes("nasa") || norm.includes("orbit")) {
      results.push({
        title: "Deep Space Explorer - Interactive Cosmic Simulator",
        snippet: "Launch the native Spatial Space Explorer application. Analyze celestial bodies, track orbit synchronization vectors, and view galactic telemetry details directly in 3D.",
        url: "space-explorer",
        isInternal: true,
        type: "space"
      });
    }

    // 3. Wikipedia specific results
    if (norm.includes("wikipedia") || norm.includes("encyclopedia") || norm.includes("learn") || norm.includes("wiki") || norm.includes("react") || norm.includes("three")) {
      results.push({
        title: "Wikipedia Mobile - The Free Encyclopedia",
        snippet: "Access millions of free informational articles. Highly optimized interface rendered directly inside your spatial browser instance.",
        url: "https://en.m.wikipedia.org",
        isInternal: true,
        type: "wiki"
      });
    }

    // Add comprehensive default results to make the page look full and professional
    results.push(
      {
        title: "SpatialCreator 3D - Holographic Sandbox Tool",
        snippet: "A native immersive tool to dynamically construct glassmorphic physical objects (Cubes, Spheres, Cylinders) and position them in real-time space utilizing visionOS style pinch gesture mechanics.",
        url: "https://spatialcreator.internal",
        isInternal: false,
        type: "space"
      },
      {
        title: "Introduction to React Three Fiber (R3F)",
        snippet: "React Three Fiber is a React reconciler for Three.js. Build premium responsive 3D scenes declaratively with re-usable, self-contained components that react to state changes.",
        url: "https://react-three-fiber.docs",
        isInternal: false,
        type: "wiki"
      },
      {
        title: "DuckDuckGo - Privacy-Oriented Search Engine Features",
        snippet: "Learn how DuckDuckGo protects your digital footprint. No tracking, no filter bubbles, just pure privacy and clean, concise search results tailored for the modern spatial web.",
        url: "https://duckduckgo.com/about",
        isInternal: false,
        type: "general"
      }
    );

    return results;
  };

  const results = getSearchResults(query);

  // If no query, render the beautiful DuckDuckGo landing page
  if (!query) {
    return (
      <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-8 font-sans select-none overflow-hidden relative">
        {/* Glow Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />

        <div className="max-w-[480px] w-full flex flex-col items-center gap-8 z-10 relative">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Mascot Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-xl border border-orange-400/30">
              <span className="text-4xl">🦆</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              DuckDuckGo <span className="text-orange-400 font-light">Spatial</span>
            </h1>
            <p className="text-xs text-neutral-400 max-w-[320px]">
              The search engine that doesn't track you. Re-imagined in a fully native immersive 3D interface.
            </p>
          </div>

          {/* Glowing Search Bar */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus-within:border-orange-500/40 focus-within:bg-white/10 focus-within:shadow-[0_0_25px_rgba(249,115,22,0.15)] transition-all duration-300">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search the private web..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent text-white text-sm outline-none w-full placeholder-neutral-500 font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase hover:bg-orange-600 active:scale-95 transition-all duration-150 shadow-md shadow-orange-500/20"
              >
                Search
              </button>
            </div>
          </form>

          {/* Features Widgets */}
          <div className="grid grid-cols-3 gap-3 w-full text-center mt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1.5">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Tracker Block</h4>
              <p className="text-[9px] text-neutral-400 leading-normal">Blocks invasive trackers</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1.5">
              <Globe className="w-5 h-5 text-sky-400" />
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Unbiased</h4>
              <p className="text-[9px] text-neutral-400 leading-normal">Clean unfiltered findings</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1.5">
              <span className="text-lg">🔒</span>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Private Search</h4>
              <p className="text-[9px] text-neutral-400 leading-normal">No trace is left behind</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render search results page
  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Search Header Bar */}
      <div className="px-6 py-4 bg-slate-900 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate("https://duckduckgo.com")}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold transition-all duration-150"
          >
            🦆
          </button>
          <form onSubmit={handleSearch} className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-orange-500/30 transition-all duration-200">
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent text-white text-[11px] outline-none w-full placeholder-neutral-500"
              />
              <button type="submit" className="hidden" />
            </div>
          </form>
        </div>
        <div className="text-[10px] font-mono text-neutral-500 bg-white/5 px-2.5 py-1 rounded-lg">
          🔍 Results for: <span className="text-orange-400 font-bold">"{query}"</span>
        </div>
      </div>

      {/* Results Workspace Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Results Column */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-[10px] text-neutral-500 font-mono">Found {results.length} highly relevant spatial matches</p>

          <div className="space-y-3.5">
            {results.map((res, index) => (
              <div
                key={index}
                onClick={() => {
                  if (res.isInternal) {
                    onNavigate(res.url);
                  }
                }}
                className={`p-4 rounded-2xl border text-left bg-gradient-to-tr transition-all duration-200 select-none ${
                  res.isInternal
                    ? "from-sky-500/10 to-indigo-500/5 border-sky-400/25 cursor-pointer hover:border-sky-400/40 hover:scale-[1.01] hover:shadow-[0_4px_20px_rgba(56,189,248,0.06)]"
                    : "from-white/5 to-white/0 border-white/5 cursor-default"
                }`}
              >
                {/* Header elements */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {res.type === "video" && <PlayCircle className="w-4 h-4 text-rose-400" />}
                    {res.type === "wiki" && <BookOpen className="w-4 h-4 text-sky-400" />}
                    {res.type === "space" && <Compass className="w-4 h-4 text-purple-400 animate-pulse" />}
                    {res.type === "general" && <Globe className="w-4 h-4 text-orange-400" />}
                    
                    <span className="text-[9px] font-mono text-neutral-400 font-semibold">{res.url}</span>
                  </div>
                  {res.isInternal && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono font-bold uppercase tracking-wider">
                      Load Native 3D
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                  {res.title}
                  {res.isInternal && <ArrowRight className="w-3.5 h-3.5 text-sky-400" />}
                </h3>

                <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
                  {res.snippet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info Card Panel */}
        <div className="w-[200px] border-l border-white/5 bg-slate-950/50 p-5 hidden md:flex flex-col gap-4 overflow-y-auto shrink-0 select-none">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest font-mono">
              Wiki Instant Answer
            </span>
            <div className="text-center py-2">
              <span className="text-3xl">💡</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white capitalize mb-1">{query}</h4>
              <p className="text-[10px] text-neutral-400 leading-normal">
                You searched for <span className="text-white font-medium">"{query}"</span>. In a spatial 3D OS environment, search queries load native app bookmarks or custom simulated views to bypass standard iframe CORS blocks.
              </p>
            </div>
            {query.toLowerCase().includes("youtube") && (
              <button
                onClick={() => onNavigate("https://www.youtube.com/embed/lP157TMn-x8")}
                className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold transition-all duration-150 flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-3.5 h-3.5" /> Play Lo-Fi Stream
              </button>
            )}
            {query.toLowerCase().includes("space") && (
              <button
                onClick={() => onNavigate("space-explorer")}
                className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-[10px] font-bold transition-all duration-150 flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" /> Launch Space Sim
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
