import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZ1AfUIM3QiuOl2y5B5oxW2i_KmI6N-y8",
  authDomain: "prayerapp-aab79.firebaseapp.com",
  projectId: "prayerapp-aab79",
  storageBucket: "prayerapp-aab79.firebasestorage.app",
  messagingSenderId: "838565477178",
  appId: "1:838565477178:web:1bd25c46c06851e858ee03",
  measurementId: "G-TL4J087SYG"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
