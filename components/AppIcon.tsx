export default function AppIcon({ label, src }: { label: string, src: string }) {
  return (
    <button className="group flex flex-col items-center gap-2 w-20 focus:outline-none">
      {/* Icon Container with Vision Pro hover effects */}
      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg transition-all duration-300 ease-out group-hover:scale-115 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] group-active:scale-95 bg-transparent">
        <img 
          src={src} 
          alt={label} 
          className="w-full h-full object-cover"
          // Graceful fallback text if images take a moment to load
          onError={(e) => { e.currentTarget.style.display = 'none'; }} 
        />
      </div>
      {/* Label styled with a fine Apple drop-shadow for readability over any background */}
      <span className="text-[11px] font-medium tracking-wide text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors duration-200 group-hover:text-white">
        {label}
      </span>
    </button>
  );
}