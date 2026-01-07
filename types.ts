
export interface Track {
  id: string;
  title: string;
  artist: string;
  audioURL: string;
  vibeTag: string;
  timestamp: number;
  coverArt?: string;
}

export interface User {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

export type WindowType = 'player' | 'tracklist' | 'admin' | 'about';

export interface WindowState {
  id: WindowType;
  isOpen: boolean;
  zIndex: number;
}
