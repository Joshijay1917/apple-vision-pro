import { useEffect, useState } from "react";
import { CirclePlay, Mountain, Users } from "lucide-react";
import AppIcon from "../AppIcon";
import Envs from "./Environments/Envs";
import SpatialCreatorUI from "./Applications/SpatialCreator/SpatialCreatorUI";
import SettingsUI from "./Applications/Settings/SettingsUI";
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
  const [sidePanelOpen, setSidePanelOpen] = useState<'main' | 'users' | 'env' | 'SpatialCreator' | 'Settings'>('main');
  const { setSpatialCreatorOpen } = useApplication();
  const [comingSoonApp, setComingSoonApp] = useState<string | null>(null);

  const triggerComingSoon = (appName: string) => {
    setComingSoonApp(appName);
  };

  useEffect(() => {
    if (comingSoonApp) {
      const timer = setTimeout(() => {
        setComingSoonApp(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [comingSoonApp]);

  useEffect(() => {
    setSpatialCreatorOpen(sidePanelOpen === 'SpatialCreator');
    return () => {
      setSpatialCreatorOpen(false);
    };
  }, [sidePanelOpen, setSpatialCreatorOpen]);

  return (
    <div className="flex items-center gap-10 font-sans select-none pointer-events-auto animate-fade-in relative min-h-[300px] justify-center">
      {comingSoonApp && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="px-6 py-4 rounded-2xl bg-gray-900/85 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-3 text-white pointer-events-auto">
            <span className="text-xl animate-pulse">✨</span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold tracking-wide text-white">{comingSoonApp}</span>
              <span className="text-[10px] text-white/50 tracking-wider uppercase font-medium">Coming Soon to Spatial OS</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= DETACHED SPATIAL CREATOR INTERFACE ================= */}
      {sidePanelOpen === 'SpatialCreator' ? (
        <SpatialCreatorUI openPanel={sidePanelOpen} setOpenPanel={setSidePanelOpen} />
      ) : sidePanelOpen === 'Settings' ? (
        <SettingsUI setOpenPanel={setSidePanelOpen} />
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
                  <AppIcon label="TV" src="/icons/tv.png" onClick={() => triggerComingSoon("TV")} />
                  <AppIcon label="Music" src="/icons/Music.png" onClick={() => triggerComingSoon("Music")} />
                  <AppIcon label="Mindfulness" src="/icons/Mindfulness.png" onClick={() => triggerComingSoon("Mindfulness")} />
                  <AppIcon label="Settings" src="/icons/settings.png" onClick={() => setSidePanelOpen("Settings")} />
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
                  <AppIcon label="Photos" src="/icons/photos.png" onClick={() => triggerComingSoon("Photos")} />
                  <AppIcon label="Key notes" src="/icons/Keynotes.png" onClick={() => triggerComingSoon("Key Notes")} />
                  <AppIcon label="App Store" src="/icons/appstore.png" onClick={() => triggerComingSoon("App Store")} />
                </div>

                {/* ROW 3: 4 Items */}
                <div className="flex gap-8 justify-center">
                  <AppIcon label="Mail" src="/icons/mail.png" onClick={() => triggerComingSoon("Mail")} />
                  <AppIcon label="Messages" src="/icons/messages.png" onClick={() => triggerComingSoon("Messages")} />
                  <AppIcon label="Notes" src="/icons/notes.png" onClick={() => triggerComingSoon("Notes")} />
                  <AppIcon label="More Apps" src="/icons/apps.png" onClick={() => triggerComingSoon("More Apps")} />
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