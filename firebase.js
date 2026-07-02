import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
