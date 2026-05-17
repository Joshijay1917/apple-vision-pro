import { useState } from "react";

export default function TestPanel() {
    // State to track the active interaction type
    const [lastEvent, setLastEvent] = useState<string>("None");
    // State to change the panel border color dynamically based on event
    const [statusColor, setStatusColor] = useState<string>("border-white/20");

    const triggerEvent = (eventName: string, tailwindBorderColor: string) => {
        setLastEvent(eventName);
        setStatusColor(tailwindBorderColor);
    };

    return (
        <div className={`w-56 bg-neutral-900/80 backdrop-blur-xl p-5 rounded-2xl border ${statusColor} shadow-2xl transition-all duration-300 font-sans text-white select-none`}>
            {/* Header */}
            <h1 className="text-lg font-semibold tracking-wide text-white/90">
                Interaction Panel
            </h1>

            {/* Live Event Monitor */}
            <div className="mt-3 px-3 py-2 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">Last Event:</span>
                <span className="text-xs font-mono font-bold tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md uppercase animate-pulse">
                    {lastEvent}
                </span>
            </div>

            {/* The Interactive 3D Target Button */}
            <button
                // 1. HOVER ENTER
                onMouseEnter={() => triggerEvent("Hovered", "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]")}

                // 2. HOVER LEAVE
                onMouseLeave={() => triggerEvent("Unhovered", "border-white/20")}

                // 3. MOUSE DOWN (CLICK START)
                onMouseDown={() => triggerEvent("Clicked", "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]")}

                // 4. ACTION CALLBACK
                onClick={() => {
                    console.log("3D Spatial Button successfully triggered!");
                }}

                className="mt-5 w-full bg-white text-black font-medium tracking-wide text-sm py-2.5 px-4 rounded-xl shadow-lg hover:bg-neutral-200 active:scale-95 transition-all duration-200 focus:outline-none"
            >
                Interact Target
            </button>

            {/* Subtle window handle line typical in Vision Pro designs */}
            <div className="w-16 h-1 bg-white/10 mx-auto mt-4 rounded-full" />
        </div>
    );
}