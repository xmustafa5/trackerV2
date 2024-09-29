// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6s_XXy_dW7fp_GLF9DKfGYq-v6GI447U",
  authDomain: "traker-ce672.firebaseapp.com",
  projectId: "traker-ce672",
  storageBucket: "traker-ce672.appspot.com",
  messagingSenderId: "1052243044919",
  appId: "1:1052243044919:web:3bf6026badc4ecf9692db2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
