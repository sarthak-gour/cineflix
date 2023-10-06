import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "react-netflix-clone-11b97.firebaseapp.com",
  projectId: "react-netflix-clone-11b97",
  storageBucket: "react-netflix-clone-11b97.appspot.com",
  messagingSenderId: "277608337820",
  appId: "1:277608337820:web:d8d69bf69d9a269ed6f859",
  measurementId: "G-X4BMC68V0M"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);