import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyAYv8GXnQBV0lb6EeOmFxWHA1D1jVNvXE8",
    authDomain: "capestone---2024.firebaseapp.com",
    projectId: "capestone---2024",
    storageBucket: "capestone---2024.appspot.com",
    messagingSenderId: "219814978192",
    appId: "1:219814978192:web:690ecd33133658ee03ae15"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};
export const storage = getStorage(app);