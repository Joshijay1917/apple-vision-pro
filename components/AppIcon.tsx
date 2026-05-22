import { useState } from "react";

export default function AppIcon({ 
  label, 
  src, 
  onClick, 
  isActive 
}: { 
  label: string; 
  src: string; 
  onClick?: () => void; 
  isActive?: boolean; 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col items-center gap-2 w-20 focus:outline-none"
    >
      {/* Icon Container with Vision Pro hover effects driven by React state */}
      <div className={`w-16 h-16 rounded-full overflow-hidden shadow-lg transition-all duration-300 ease-out group-active:scale-95 bg-transparent ${
        isHovered || isActive ? 'scale-115 shadow-[0_0_25px_rgba(255,255,255,0.4)] ring-2 ring-white/50' : ''
      }`}>
        <img 
          src={src} 
          alt={label} 
          className="w-full h-full object-cover"
          // Graceful fallback text if images take a moment to load
          onError={(e) => { e.currentTarget.style.display = 'none'; }} 
        />
      </div>
      {/* Label styled with a fine Apple drop-shadow for readability over any background */}
      <span className={`text-[11px] font-medium tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors duration-200 ${
        isHovered || isActive ? 'text-white' : 'text-white/70'
      }`}>
        {label}
      </span>
    </button>
  );
}