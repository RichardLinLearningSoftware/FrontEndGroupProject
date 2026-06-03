// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCyiWqrC_Ecyd_B_8eMvhbrOAs3R3dZuP4",
  authDomain: "socialmediaproject-4d298.firebaseapp.com",
  projectId: "socialmediaproject-4d298",
  storageBucket: "socialmediaproject-4d298.firebasestorage.app",
  messagingSenderId: "977346968764",
  appId: "1:977346968764:web:8ae00e62414702512164b9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);