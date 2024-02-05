import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-9d954.firebaseapp.com",
  projectId: "real-estate-9d954",
  storageBucket: "real-estate-9d954.appspot.com",
  messagingSenderId: "923497807356",
  appId: "1:923497807356:web:909a49c59c43f43e9f4679"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};