
// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

// Import Firebase Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

// Import Cloud Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAOcixjfs7PPsD6kZWdRfNh6rVo1lJBd0",
  authDomain: "my-personal-website-3a801.firebaseapp.com",
  projectId: "my-personal-website-3a801",
  storageBucket: "my-personal-website-3a801.firebasestorage.app",
  messagingSenderId: "455379362790",
  appId: "1:455379362790:web:ecd3840cddd2dfe54aac27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Confirm initialization
console.log("Firebase initialized successfully!");
