
import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { auth, storage, db } from '../firebase';
import { useAudio } from '../AudioContext';

const AdminTerminal: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const { tracks } = useAudio();

  const [form, setForm] = useState({
    title: '',
    artist: '',
    vibeTag: 'High Energy'
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert(`ACCESS_DENIED: ${error.message}\n\nTIP: Ensure "Email/Password" is enabled in Firebase Auth > Sign-in Method.`);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) return alert('ERR: NO_FILE_SELECTED');
    
    setUploading(true);
    setUploadProgress('UPLOADING_BYTES...');

    try {
      // 1. Upload to Storage
      const storageRef = ref(storage, `audio/${Date.now()}_${audioFile.name}`);
      const snapshot = await uploadBytes(storageRef, audioFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setUploadProgress('COMMITTING_METADATA...');

      // 2. Save to Firestore
      await addDoc(collection(db, 'tracks'), {
        title: form.title,
        artist: form.artist,
        vibeTag: form.vibeTag,
        audioURL: downloadURL,
        storagePath: snapshot.ref.fullPath,
        timestamp: Date.now()
      });

      setUploading(false);
      setUploadProgress('');
      setForm({ title: '', artist: '', vibeTag: 'High Energy' });
      setAudioFile(null);
      alert('FILE_UPLOAD_SUCCESS: NODE_SYNCHRONIZED');
    } catch (error: any) {
      console.error(error);
      alert(`UPLOAD_FAILED: ${error.message}\n\nCheck Storage & Firestore rules.`);
      setUploading(false);
    }
  };

  const deleteTrack = async (id: string, storagePath?: string) => {
    if (window.confirm('RM_RF: ARE_YOU_SURE?')) {
      try {
        if (storagePath) {
          const fileRef = ref(storage, storagePath);
          await deleteObject(fileRef).catch(e => console.warn('Storage file not found', e));
        }
        await deleteDoc(doc(db, 'tracks', id));
      } catch (error: any) {
        alert(`DELETE_FAILED: ${error.message}`);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="text-red-500 font-bold mb-2 blink italic uppercase tracking-tighter">SECURITY_ALERT: RESTRICTED_AREA</div>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <label className="text-[10px] opacity-70 uppercase">Admin_Email:</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/80 border-2 border-pink-500 p-2 focus:outline-none focus:shadow-[0_0_10px_#ff00ff] text-xs text-cyan-400"
            autoComplete="email"
          />
          <label className="text-[10px] opacity-70 uppercase">Root_Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black/80 border-2 border-pink-500 p-2 focus:outline-none focus:shadow-[0_0_10px_#ff00ff] text-xs text-cyan-400"
            autoComplete="current-password"
          />
          <button type="submit" className="bg-pink-500 text-white p-2 font-bold hover:bg-pink-400 mt-2 transition-all text-xs uppercase italic">
            INITIATE_HANDSHAKE
          </button>
        </form>
        <div className="mt-4 p-2 bg-cyan-950/20 border border-cyan-500/20 rounded">
          <p className="text-[9px] text-cyan-500/60 uppercase leading-relaxed italic">
            Setup: 1. Enable Email/Password in Firebase Auth. 2. Create your admin user. 3. Set Firestore rules to allow public read.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
        <h2 className="text-sm font-bold pink-glow">SYSTEM_CURATOR_v2.0</h2>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-cyan-500 opacity-60 truncate max-w-[100px]">{user.email}</span>
          <button onClick={handleLogout} className="text-[10px] border border-red-500 px-2 text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase">
            LOGOUT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase text-cyan-400 border-b border-cyan-500/20 pb-1 italic">Ingest_New_Media</h3>
          <form onSubmit={handleUpload} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] opacity-60 uppercase">Track_Title</label>
              <input 
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="bg-black/50 border border-cyan-500/50 p-1.5 text-xs focus:border-cyan-400 focus:outline-none text-cyan-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] opacity-60 uppercase">Artist_Name</label>
              <input 
                required
                value={form.artist}
                onChange={e => setForm({...form, artist: e.target.value})}
                className="bg-black/50 border border-cyan-500/50 p-1.5 text-xs focus:border-cyan-400 focus:outline-none text-cyan-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] opacity-60 uppercase">Vibe_Tag</label>
              <select 
                value={form.vibeTag}
                onChange={e => setForm({...form, vibeTag: e.target.value})}
                className="bg-black/50 border border-cyan-500/50 p-1.5 text-xs focus:border-cyan-400 focus:outline-none appearance-none text-cyan-400 uppercase"
              >
                <option>High Energy</option>
                <option>Chillwave</option>
                <option>Darksynth</option>
                <option>Outrun</option>
                <option>Vaporwave</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] opacity-60 uppercase">MP3_DATA_PACKET</label>
              <input 
                type="file"
                accept="audio/mpeg"
                onChange={e => setAudioFile(e.target.files ? e.target.files[0] : null)}
                className="text-[10px] file:bg-cyan-900 file:text-cyan-400 file:border-0 file:px-2 file:py-1 file:mr-2 hover:file:bg-cyan-800 text-cyan-500"
              />
            </div>
            <button 
              disabled={uploading}
              className={`bg-cyan-500 text-black font-bold p-2 mt-2 transition-all hover:bg-cyan-400 uppercase text-xs italic ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? uploadProgress : 'COMMIT_TO_DATABASE'}
            </button>
          </form>
        </div>

        {/* Existing Tracks Management */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase text-cyan-400 border-b border-cyan-500/20 pb-1 italic">Manage_Inventory</h3>
          <div className="max-h-64 overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
            {tracks.map(track => (
              <div key={track.id} className="bg-white/5 border border-cyan-500/20 p-2 flex items-center justify-between group hover:bg-pink-500/5 transition-colors">
                <div className="flex-1 truncate">
                  <div className="text-[10px] font-bold truncate uppercase text-cyan-300">{track.title}</div>
                  <div className="text-[8px] opacity-50 italic text-pink-500">{track.artist}</div>
                </div>
                <button 
                  onClick={() => deleteTrack(track.id, (track as any).storagePath)}
                  className="p-1 text-red-500 hover:bg-red-500 hover:text-white transition-all ml-2"
                  title="WIPE_DATA"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
            ))}
            {tracks.length === 0 && (
              <div className="text-[9px] opacity-30 italic text-center py-8">INVENTORY_EMPTY</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTerminal;
