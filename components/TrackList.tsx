
import React, { useState } from 'react';
import { useAudio } from '../AudioContext';
import { Track } from '../types';

interface TrackListProps {
  initialTracks: Track[]; // Kept for interface stability, but tracks come from context
}

const TrackList: React.FC<TrackListProps> = () => {
  const { playTrack, currentTrack, tracks, dbError } = useAudio();
  const [filter, setFilter] = useState('');
  const [vibe, setVibe] = useState('ALL');

  const vibes = ['ALL', ...Array.from(new Set(tracks.map(t => t.vibeTag)))];

  const filteredTracks = tracks.filter(t => 
    (vibe === 'ALL' || t.vibeTag === vibe) &&
    (t.title.toLowerCase().includes(filter.toLowerCase()) || t.artist.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filters */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="SEARCH_DB..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-black/50 border border-cyan-500/50 p-2 text-xs focus:border-cyan-400 focus:outline-none placeholder:opacity-30 italic"
          />
          <div className="absolute right-2 top-2 text-[10px] opacity-30 uppercase">HEX_SRCH</div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {vibes.map(v => (
            <button 
              key={v}
              onClick={() => setVibe(v)}
              className={`text-[10px] px-2 py-0.5 border transition-all ${vibe === v ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_8px_#00ffff]' : 'border-cyan-500/30 text-cyan-500 hover:border-cyan-400 uppercase'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col border border-pink-500/20 divide-y divide-pink-500/10">
        <div className="flex text-[10px] p-2 bg-pink-500/10 text-pink-300 font-bold tracking-widest uppercase italic">
          <div className="w-8">#</div>
          <div className="flex-1">TITLE // ARTIST</div>
          <div className="w-20 text-right">VIBE</div>
        </div>
        
        <div className="max-h-80 overflow-y-auto min-h-[140px] relative">
          {dbError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-md z-[50] border-2 border-red-500/30">
              <div className="text-red-500 font-black text-xs blink mb-2 uppercase italic tracking-widest">{dbError}</div>
              <p className="text-[10px] text-red-400/80 text-center mb-4 leading-relaxed uppercase">
                FIRESTORE SECURITY BREACH: Rules must be updated to allow public READ.
              </p>
              <div className="w-full bg-black border border-red-500/30 p-2 rounded text-[9px] font-mono text-cyan-400/70 select-all mb-4 overflow-x-auto">
                <pre className="whitespace-pre">
{`service cloud.firestore {
  match /databases/{database}/documents {
    match /tracks/{track} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
                </pre>
              </div>
              <p className="text-[9px] text-pink-500 opacity-50 uppercase">PASTE THIS INTO: FIRESTORE > RULES</p>
            </div>
          ) : null}

          {filteredTracks.map((track, i) => (
            <div 
              key={track.id}
              onClick={() => playTrack(track)}
              className={`flex items-center p-2 text-xs cursor-pointer transition-colors group ${currentTrack?.id === track.id ? 'bg-cyan-500/20 text-cyan-400 shadow-[inset_0_0_10px_rgba(0,255,255,0.1)]' : 'hover:bg-pink-500/10 text-cyan-100'}`}
            >
              <div className="w-8 font-mono opacity-50 group-hover:opacity-100">
                {currentTrack?.id === track.id ? '►' : (i + 1).toString().padStart(2, '0')}
              </div>
              <div className="flex-1 truncate pr-2">
                <div className="font-bold group-hover:text-white transition-colors uppercase tracking-tight truncate">{track.title}</div>
                <div className="text-[10px] opacity-60 italic truncate">{track.artist}</div>
              </div>
              <div className="w-20 text-right text-[10px] text-pink-500 font-bold italic">
                {track.vibeTag}
              </div>
            </div>
          ))}

          {!dbError && filteredTracks.length === 0 && (
            <div className="p-12 text-center text-xs opacity-50 italic uppercase tracking-[0.2em]">
              QUERY_RETURNED_NULL_SET
            </div>
          )}
        </div>
      </div>

      <div className="text-[10px] opacity-30 flex justify-between uppercase">
        <span>ITEMS_LOADED: {filteredTracks.length}</span>
        <span>SYNC_STATUS: {dbError ? 'FAILURE' : 'OK'}</span>
      </div>
    </div>
  );
};

export default TrackList;
