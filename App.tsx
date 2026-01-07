
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioProvider, useAudio } from './AudioContext';
import GridBackground from './components/GridBackground';
import Window from './components/Window';
import MusicPlayer from './components/MusicPlayer';
import TrackList from './components/TrackList';
import AdminTerminal from './components/AdminTerminal';
import SystemMarquee from './components/SystemMarquee';
import { WindowType, WindowState } from './types';

const INITIAL_WINDOWS: WindowState[] = [
  { id: 'player', isOpen: true, zIndex: 10 },
  { id: 'tracklist', isOpen: true, zIndex: 5 },
  { id: 'admin', isOpen: false, zIndex: 1 },
];

const AppContent: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(20);
  const { dbError } = useAudio();

  const toggleWindow = (id: WindowType) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isOpen: !w.isOpen, zIndex: w.isOpen ? w.zIndex : topZ + 1 } : w
    ));
    if (!windows.find(w => w.id === id)?.isOpen) setTopZ(prev => prev + 1);
  };

  const focusWindow = (id: WindowType) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: topZ + 1 } : w
    ));
    setTopZ(prev => prev + 1);
  };

  const getWindowState = (id: WindowType) => windows.find(w => w.id === id);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-cyan-400 select-none">
      <GridBackground />
      
      {/* Desktop Header */}
      <header className="absolute top-8 left-8 z-50 pointer-events-none">
        <h1 className="text-5xl font-black italic crt-glow pixel-font">
          SYNTHWAVE <span className="pink-glow">SOUNDS</span>
        </h1>
        <p className="text-sm opacity-50 tracking-[0.4em] mt-2 uppercase">Cyber_OS v3.2 // Node_Online</p>
      </header>

      {/* Global Marquee */}
      <SystemMarquee />

      {/* Windows */}
      <AnimatePresence>
        {getWindowState('player')?.isOpen && (
          <Window 
            title="AUDIO_PLAYER.EXE" 
            id="player" 
            zIndex={getWindowState('player')!.zIndex}
            onClose={() => toggleWindow('player')}
            onFocus={() => focusWindow('player')}
            defaultPos={{ x: 50, y: 140 }}
          >
            <MusicPlayer />
          </Window>
        )}

        {getWindowState('tracklist')?.isOpen && (
          <Window 
            title="TRACK_DATABASE.DB" 
            id="tracklist" 
            zIndex={getWindowState('tracklist')!.zIndex}
            onClose={() => toggleWindow('tracklist')}
            onFocus={() => focusWindow('tracklist')}
            defaultPos={{ x: 550, y: 140 }}
          >
            <TrackList initialTracks={[]} />
          </Window>
        )}

        {getWindowState('admin')?.isOpen && (
          <Window 
            title="ADMIN_TERMINAL.SH" 
            id="admin" 
            zIndex={getWindowState('admin')!.zIndex}
            onClose={() => toggleWindow('admin')}
            onFocus={() => focusWindow('admin')}
            defaultPos={{ x: 300, y: 250 }}
          >
            <AdminTerminal />
          </Window>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <nav className="absolute bottom-0 left-0 w-full h-12 cyber-panel border-t-2 border-pink-500 z-[100] flex items-center px-4 gap-4">
        <div className="flex gap-2">
          <TaskButton active={getWindowState('player')?.isOpen} onClick={() => toggleWindow('player')}>PLAYER</TaskButton>
          <TaskButton active={getWindowState('tracklist')?.isOpen} onClick={() => toggleWindow('tracklist')}>DATABASE</TaskButton>
          <TaskButton active={getWindowState('admin')?.isOpen} onClick={() => toggleWindow('admin')}>ADMIN</TaskButton>
        </div>
        <div className="ml-auto text-xs opacity-50 flex items-center gap-6">
          <div className="flex items-center gap-2 uppercase">
            {dbError ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_#ef4444]"></div>
                <span className="text-red-400 font-bold">DB_LOCK</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div>
                <span>DB_CONNECTED</span>
              </>
            )}
          </div>
          <span className="hidden sm:inline">MEM: 640KB</span>
          <Clock />
        </div>
      </nav>
    </div>
  );
};

const TaskButton: React.FC<{ children: React.ReactNode, active?: boolean, onClick: () => void }> = ({ children, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 h-8 text-[10px] font-bold border-2 transition-all ${active ? 'bg-pink-500 text-white border-pink-300 shadow-[0_0_10px_#ff00ff]' : 'border-cyan-500/50 hover:bg-cyan-900/50 hover:border-cyan-400'}`}
  >
    {children}
  </button>
);

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span>{time.toLocaleTimeString([], { hour12: false })}</span>
};

const App: React.FC = () => (
  <AudioProvider>
    <AppContent />
  </AudioProvider>
);

export default App;
