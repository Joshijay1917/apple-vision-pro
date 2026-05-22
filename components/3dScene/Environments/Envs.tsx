import { useScene } from "@/context/SceneContext";
import { Compass } from "lucide-react";
import { useState } from "react";

const ENVIRONMENTS = [
  {
    id: "yosemite",
    name: "Yosemite Valley",
    path: "/Environments/hdri1.jpg",
    thumbnail: "/Environments/hdri1.jpg",
    description: "Mountain sunset peak"
  },
  {
    id: "forest",
    name: "Forest",
    path: "/Environments/hdri2.jpg",
    thumbnail: "/Environments/hdri2.jpg",
    description: "Forest"
  }
];

export default function Envs({ activeEnv, setActiveEnv }: { activeEnv: string, setActiveEnv: (env: string) => void }) {
  const [isHovered, setIsHovered] = useState("yosemite");

  return (
    <div className=" rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-white font-sans flex flex-col items-center p-5 gap-4 animate-fade-in">
      <div className="flex items-center gap-2 border-b border-white/10 w-full pb-2.5">
        <Compass className="w-5 h-5 text-white/70" />
        <h2 className="text-base font-semibold tracking-wide text-white/90">Environments</h2>
      </div>

      <div className="w-full flex flex-row overflow-y-auto pr-1 flex flex-col gap-10 custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {ENVIRONMENTS.map((env) => {
          const isSelected = isHovered === env.id || activeEnv === env.path;
          return (
            <button
              key={env.id}
              onClick={() => setActiveEnv(env.path)}
              onMouseEnter={() => setIsHovered(env.id)}
              onMouseLeave={() => setIsHovered(activeEnv)}
              className={`w-full h-full object-cover object-center ${isSelected ? "scale-105" : ""}`}
            >
              {/* Environment Thumbnail */}
              {/* <div className={`w-12 h-12 rounded-xl overflow-hidden relative border transition-all duration-300 ${isSelected ? "border-cyan-400 scale-95" : "border-white/10 group-hover:border-white/30" */}
              {/* }`}> */}
              <img
                src={env.thumbnail}
                alt={env.name}
              />
              {/* </div> */}
            </button>
          );
        })}
      </div>
    </div>
  );
}