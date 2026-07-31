import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase dengan sistem "Ban Serep" untuk proses Build
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyA_Ys2CVfwRfPfyN5LL6OfUq6fWj34wg7w",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "profilcode.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "profilcode",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "profilcode.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1022959282460",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:1022959282460:web:2a8e71f35f1248ec2232d9",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-66CGDZ176M",
};

// Initialize Firebase (Singleton Pattern untuk mencegah error double-render)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export required modules
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
