import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//configuración del proyecto — Authentication y Firestore
const firebaseConfig = {
  apiKey: "AIzaSyB-xrfQbtJfNSBJosfR4fF2pgblz8oXRHg",
  authDomain: "killavet-app.firebaseapp.com",
  projectId: "killavet-app",
  storageBucket: "killavet-app.firebasestorage.app",
  messagingSenderId: "734616003570",
  appId: "1:734616003570:web:5666699fae21f30041816b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
