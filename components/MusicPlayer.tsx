
import React, { useState } from 'react';
import { useAudio } from '../AudioContext';
import Visualizer from './Visualizer';

const MusicPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    progress, 
    duration, 
    seek, 
    volume, 
    setVolume,
    isShuffle,
    setIsShuffle
  } = useAudio();

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Artwork & Info */}
      <div className="flex gap-4">
        <div className="w-32 h-32 bg-pink-500/20 neon-border flex items-center justify-center relative overflow-hidden group">
          {currentTrack ? (
            <img src={`https://picsum.photos/seed/${currentTrack.id}/200`} alt="Cover" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="text-4xl">💿</div>
          )}
          <div className="absolute inset-0 bg-cyan-400/10 group-hover:bg-transparent transition-colors"></div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-xl font-bold truncate crt-glow text-cyan-400">
            {currentTrack?.title || 'NO_SIGNAL'}
          </h3>
          <p className="text-pink-500 font-bold text-sm tracking-wider">
            {currentTrack?.artist || 'SYSTEM_VOID'}
          </p>
          <div className="mt-2 inline-block px-2 py-0.5 bg-cyan-900/30 border border-cyan-500 text-[10px] text-cyan-400 uppercase tracking-tighter w-fit">
            AI-GENERATED AUDIO
          </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="h-16 w-full bg-black/40 border border-pink-500/50 rounded overflow-hidden">
        <Visualizer isActive={isPlaying} />
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1">
        <input 
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="w-full h-1 bg-cyan-900 appearance-none cursor-pointer accent-cyan-400 rounded-full"
          style={{
            background: `linear-gradient(90deg, #00ffff ${(progress/duration)*100}%, #164e63 0%)`
          }}
        />
        <div className="flex justify-between text-[10px] opacity-70">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <button onClick={() => setIsShuffle(!isShuffle)} className={`text-sm ${isShuffle ? 'text-cyan-400' : 'text-gray-600 hover:text-cyan-400'}`}>
          SHUF
        </button>
        
        <div className="flex items-center gap-4">
          <button onClick={prevTrack} className="hover:text-pink-500 transition-colors">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center hover:bg-cyan-400 hover:text-[#0d0221] transition-all shadow-[0_0_15px_#00ffff]"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button onClick={nextTrack} className="hover:text-pink-500 transition-colors">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="m6 18 8.5-6L6 6zM16 6h2v12h-2z"/></svg>
          </button>
        </div>

        <div className="flex items-center gap-2 group relative">
          <svg className="w-4 h-4 fill-cyan-400" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-cyan-900 accent-pink-500 appearance-none cursor-pointer rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
