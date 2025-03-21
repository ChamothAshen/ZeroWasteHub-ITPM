// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "waste-management-system-ca43a.firebaseapp.com",
  projectId: "waste-management-system-ca43a",
  storageBucket: "waste-management-system-ca43a.firebasestorage.app",
  messagingSenderId: "56749472916",
  appId: "1:56749472916:web:beb75405e3fd9d98364881"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);






