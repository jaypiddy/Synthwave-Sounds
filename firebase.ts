import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // <--- 1. Must import this
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // Your API Keys here...
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialize services and export them
export const auth = getAuth(app); 
export const db = getFirestore(app);
export const storage = getStorage(app);
