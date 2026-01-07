
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCb9dkl_VAt0NdT6gOD_cOjktMnMSyagTQ",
  authDomain: "sythwave-sounds.firebaseapp.com",
  projectId: "sythwave-sounds",
  storageBucket: "sythwave-sounds.firebasestorage.app",
  messagingSenderId: "965534894244",
  appId: "1:965534894244:web:c1017eb0fdfbc12cccfe31",
  measurementId: "G-PYH53E9TJH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
