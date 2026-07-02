import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlNKFNnZEeK_NVf2-XMEfQgBP_IghKlyU",
  authDomain: "mychat-3a537.firebaseapp.com",
  projectId: "mychat-3a537",
  storageBucket: "mychat-3a537.appspot.com",
  messagingSenderId: "57548891925",
  appId: "1:57548891925:web:1bc7f23176aa0fde52eb1c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
