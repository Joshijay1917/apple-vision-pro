import { useState } from "react";

export default function AppIcon({ 
  label, 
  src, 
  onClick, 
  isActive,
  isComingSoon
}: { 
  label: string; 
  src: string; 
  onClick?: () => void; 
  isActive?: boolean; 
  isComingSoon?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col items-center gap-2 w-20 focus:outline-none relative"
    >
      {/* Subtle glassmorphic 'Soon' badge at the top right of the icon */}
      {isComingSoon && (
        <div className="absolute -top-1 -right-1 bg-white/15 backdrop-blur-lg border border-white/20 px-1.5 py-0.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.4)] z-10 pointer-events-none scale-85 origin-top-right transition-transform duration-300 group-hover:scale-95">
          <span className="text-[7.5px] font-bold text-white/95 uppercase tracking-wider leading-none block">
            Soon
          </span>
        </div>
      )}

      {/* Icon Container with Vision Pro hover effects driven by React state */}
      <div className={`w-22 h-22 rounded-full overflow-hidden shadow-lg transition-all duration-300 ease-out group-active:scale-95 bg-transparent ${
        isHovered || isActive ? 'scale-115 shadow-[0_0_25px_rgba(255,255,255,0.4)] ring-2 ring-white/50' : ''
      }`}>
        <img 
          src={src} 
          alt={label} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${isComingSoon ? 'opacity-85 group-hover:opacity-100' : ''}`}
          // Graceful fallback text if images take a moment to load
          onError={(e) => { e.currentTarget.style.display = 'none'; }} 
        />
      </div>

      {/* Label and Coming Soon text styled with a fine Apple drop-shadow */}
      <div className="flex flex-col items-center min-h-[28px] justify-start">
        <span className={`text-[11px] font-medium tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors duration-200 ${
          isHovered || isActive ? 'text-white' : 'text-white/70'
        }`}>
          {label}
        </span>
        {isComingSoon && (
          <span className="text-[8px] font-medium text-white/40 tracking-wider font-sans drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] mt-0.5 uppercase whitespace-nowrap">
            Coming Soon
          </span>
        )}
      </div>
    </button>
  );
}