import { useEffect, useState } from "react";
import { CirclePlay, Mountain, Users } from "lucide-react";
import AppIcon from "../AppIcon";
import Envs from "./Environments/Envs";
import SpatialCreatorUI from "./Applications/SpatialCreator/SpatialCreatorUI";
import { useApplication } from "@/context/ApplicationContext";

function DockButton({ children, onClick, isActive }: { children: React.ReactNode, onClick: () => void, isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${(isHovered || isActive) ? 'bg-white/30' : 'bg-transparent'
        }`}
    >
      {children}
    </button>
  );
}

export default function MainScene({
  activeEnv,
  setActiveEnv,
  spawnBrowser
}: {
  activeEnv: string;
  setActiveEnv: (env: string) => void;
  spawnBrowser: (url: string) => void;
}) {
  const [sidePanelOpen, setSidePanelOpen] = useState<'main' | 'users' | 'env' | 'SpatialCreator'>('main');

  return (
    <div className="flex items-center gap-10 font-sans select-none pointer-events-auto animate-fade-in relative min-h-[300px] justify-center">

      {/* ================= DETACHED SPATIAL CREATOR INTERFACE ================= */}
      {sidePanelOpen === 'SpatialCreator' ? (
        <SpatialCreatorUI openPanel={sidePanelOpen} setOpenPanel={setSidePanelOpen} />
      ) : (
        <>
          {/* ================= LEFT VERTICAL DOCK ================= */}
          <div className="flex flex-col gap-5 p-3 rounded-full bg-gray-900/70 backdrop-blur-2xl border border-white/10 shadow-xl">
            {/* Dock Item 1 */}
            <DockButton onClick={() => setSidePanelOpen('main')} isActive={sidePanelOpen === 'main'}>
              <span className="text-white text-xl"><CirclePlay /></span>
            </DockButton>
            {/* Dock Item 2 */}
            <DockButton onClick={() => setSidePanelOpen('users')} isActive={sidePanelOpen === 'users'}>
              <span className="text-white text-xl"><Users /></span>
            </DockButton>
            {/* Dock Item 3 */}
            <DockButton onClick={() => setSidePanelOpen('env')} isActive={sidePanelOpen === 'env'}>
              <span className="text-white text-xl"><Mountain /></span>
            </DockButton>
          </div>

          {sidePanelOpen === 'env' && <Envs activeEnv={activeEnv} setActiveEnv={setActiveEnv} />}

          {/* ================= MAIN INTERFACE AREA ================= */}
          {sidePanelOpen === 'main' && (
            <div className="flex flex-col items-center gap-10 animate-fade-in">
              {/* Staggered Grid Configuration */}
              <div className="flex flex-col gap-8 items-center">
                {/* ROW 1: 4 Items */}
                <div className="flex gap-8 justify-center">
                  <AppIcon label="TV" src="/icons/tv.png" />
                  <AppIcon label="Music" src="/icons/Music.png" />
                  <AppIcon label="Mindfulness" src="/icons/Mindfulness.png" />
                  <AppIcon label="Settings" src="/icons/settings.png" />
                </div>

                {/* ROW 2: 5 Items */}
                <div className="flex gap-8 justify-center">
                  <AppIcon
                    label="Spatial Creator"
                    src="/icons/freeform.png"
                    onClick={() => setSidePanelOpen('SpatialCreator')}
                    isActive={false}
                  />
                  <AppIcon
                    label="Safari"
                    src="/icons/safari.png"
                    onClick={() => spawnBrowser("home")}
                  />
                  <AppIcon label="Photos" src="/icons/photos.png" />
                  <AppIcon label="Key notes" src="/icons/Keynotes.png" />
                  <AppIcon label="App Store" src="/icons/appstore.png" />
                </div>

                {/* ROW 3: 4 Items */}
                <div className="flex gap-8 justify-center">
                  <AppIcon label="Mail" src="/icons/mail.png" />
                  <AppIcon label="Messages" src="/icons/messages.png" />
                  <AppIcon label="Notes" src="/icons/notes.png" />
                  <AppIcon label="More Apps" src="/icons/apps.png" />
                </div>
              </div>

              {/* ================= PAGINATION DOTS ================= */}
              <div className="flex gap-2 justify-center items-center">
                <div className="w-2 h-2 rounded-full bg-white opacity-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}