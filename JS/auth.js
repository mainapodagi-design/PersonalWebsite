
// Import Firebase Authentication
import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

// Get login form elements
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginButton = document.getElementById("loginButton");

// Handle login submission
loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    try {

        // Authenticate administrator
        await signInWithEmailAndPassword(auth, email, password);

        message.style.color = "#4ade80";
        message.textContent = "Login successful!";

        // Navigate to admin dashboard
        window.location.replace("admin.html");

    } catch (error) {

        console.error("Login error:", error.code);

        message.style.color = "#f87171";
        message.textContent = "Login failed. Check your email and password.";

        loginButton.disabled = false;
        loginButton.textContent = "Sign In";
    }

});
