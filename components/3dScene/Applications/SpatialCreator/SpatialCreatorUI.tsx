import { useApplication } from "@/context/ApplicationContext";

export default function SpatialCreatorUI({
    openPanel,
    setOpenPanel
}: {
    openPanel: "main" | "users" | "env" | "SpatialCreator";
    setOpenPanel: (panel: "main" | "users" | "env" | "SpatialCreator") => void;
}) {
    const { spatialCreatorShape, setSpatialCreatorShape } = useApplication();

    return (
        <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-gray-950/5 border border-white/10 shadow-2xl animate-fade-in min-w-[380px] text-center pointer-events-auto">
            <div className="flex w-full justify-between items-center border-b border-white/10 pb-3 mb-2">
                <h3 className="text-sm font-semibold tracking-wider text-white">Spatial Object Creator</h3>
                <button
                    onClick={() => setOpenPanel("main")}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-white/10 text-white/80 hover:bg-white/20 hover:text-red-300 transition-all duration-200"
                >
                    ✕
                </button>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs text-white/60 font-medium">Primitive:</span>
                {(['cube', 'sphere', 'cylinder'] as const).map((shape) => (
                    <button
                        key={shape}
                        onClick={() => setSpatialCreatorShape(shape)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${spatialCreatorShape === shape
                            ? 'bg-white text-black shadow-lg scale-105'
                            : 'bg-white/10 text-white/80 hover:bg-white/20 active:scale-95'
                            }`}
                    >
                        {shape}
                    </button>
                ))}
            </div>
            <p className="text-[11px] text-neutral-300 leading-normal max-w-[320px] bg-white/5 p-3 rounded-2xl border border-white/5 mt-2">
                ✨ <span className="text-emerald-400 font-semibold">Gesture Guide:</span> Pinch thumb & index on <strong>both hands</strong> simultaneously and expand/contract them to scale the 3D shape in real-time!
            </p>
        </div>
    )
}