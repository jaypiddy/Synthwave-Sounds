
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "SYSTEM_STATUS: ALL_SYSTEMS_OPERATIONAL",
  "WARNING: NOSTALGIA_LEVELS_EXCEEDING_SAFETY_LIMITS",
  "NEW_TRACKS_INCOMING_VIA_HYPER_LINK",
  "CYBER_CORE_v3.1_LOADED_SUCCESSFULLY",
  "ENJOY_THE_SOUND_OF_THE_FUTURE_PAST",
  "AI_GENERATED_CONTENT_DETECTED_IN_AUDIO_BUFFERS",
  "SCANNING_DEEP_WEB_FOR_NEW_VIBES...",
];

const SystemMarquee: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % MESSAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-6 bg-black border-b border-cyan-500 overflow-hidden flex items-center z-[200]">
      <div className="whitespace-nowrap flex animate-marquee">
        <span className="text-[10px] font-bold text-cyan-400 px-4">
          [!] {MESSAGES[index]} [!] {MESSAGES[(index + 1) % MESSAGES.length]} [!] {MESSAGES[(index + 2) % MESSAGES.length]}
        </span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SystemMarquee;
