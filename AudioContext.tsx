
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import { Track } from './types';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  seek: (time: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  tracks: Track[];
  isShuffle: boolean;
  setIsShuffle: (val: boolean) => void;
  dbError: string | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync with Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      const tracksRef = collection(db, 'tracks');
      const q = query(tracksRef, orderBy('timestamp', 'desc'));
      
      unsubscribe = onSnapshot(q, 
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          const tracksData: Track[] = [];
          querySnapshot.forEach((doc) => {
            tracksData.push({ id: doc.id, ...doc.data() } as Track);
          });
          setTracks(tracksData);
          setDbError(null);
        },
        (error) => {
          console.error("Firestore Snapshot Error:", error);
          if (error.code === 'permission-denied') {
            setDbError("ACCESS_DENIED: MISSING_RULES");
          } else {
            setDbError(`DB_ERROR: ${error.code.toUpperCase()}`);
          }
        }
      );
    } catch (err: any) {
      console.error("Setup Error:", err);
      setDbError("INIT_ERROR: CHECK_CONSOLE");
    }

    return () => unsubscribe();
  }, []);

  const currentTrack = currentTrackIndex >= 0 ? tracks[currentTrackIndex] : null;

  // Sync Playback State with DOM
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name === 'AbortError') return;
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, tracks, isShuffle]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = (track: Track) => {
    const index = tracks.findIndex(t => t.id === track.id);
    if (index === currentTrackIndex) {
      togglePlay();
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!currentTrack && tracks.length > 0) {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      progress,
      duration,
      playTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      setVolume,
      seek,
      audioRef,
      tracks,
      isShuffle,
      setIsShuffle,
      dbError
    }}>
      {children}
      <audio 
        key={currentTrack?.id || 'idle'}
        ref={audioRef} 
        src={currentTrack?.audioURL} 
        preload="auto"
      />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
