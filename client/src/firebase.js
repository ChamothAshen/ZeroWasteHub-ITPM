// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "zero-waste-management-7b9fe.firebaseapp.com",
  projectId: "zero-waste-management-7b9fe",
  storageBucket: "zero-waste-management-7b9fe.firebasestorage.app",
  messagingSenderId: "381862974831",
  appId: "1:381862974831:web:109445273df856434c849a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);