import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

// AK Fish Farms Firebase Configuration
// NOTE: Replace these with your actual keys from Firebase Console
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "ak-fish-farm.firebaseapp.com",
    projectId: "ak-fish-farm",
    storageBucket: "ak-fish-farm.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export for use in other modules
export {
    db,
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    query,
    orderBy,
    serverTimestamp
};

// Also attach to window for transition period if needed
window.firebaseDB = db;
