// ==========================================
// FIREBASE PROFILE CONNECTION
// ==========================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";


// ==========================================
// LOAD PROFILE INFORMATION
// ==========================================

async function loadPublicProfile() {

    try {

        const profileRef = doc(db, "profile", "main");

        const profileSnapshot = await getDoc(profileRef);

        if (!profileSnapshot.exists()) {

            console.log("No profile information found.");

            return;

        }

        const profile = profileSnapshot.data();


        // ==================================
        // BACKGROUND PAGE ELEMENTS
        // ==================================

        const backgroundName = document.getElementById("backgroundName");
        const backgroundDetailName = document.getElementById("backgroundDetailName");
        const backgroundAbout = document.getElementById("backgroundAbout");
        const backgroundPhoto = document.getElementById("backgroundPhoto");
        const backgroundProfession = document.getElementById("backgroundProfession");

        const backgroundEmail = document.getElementById("backgroundEmail");
        const backgroundPhone = document.getElementById("backgroundPhone");
        const backgroundLocation = document.getElementById("backgroundLocation");
        const backgroundCountry = document.getElementById("backgroundCountry");

        if (backgroundName) {
            backgroundName.textContent = profile.fullName || "Malachai Mainapo";
        }
        if (backgroundDetailName) {
            backgroundDetailName.textContent = profile.fullName || "Malachai Mainapo";
        }

        if (backgroundAbout) {
            backgroundAbout.textContent = profile.aboutMe || "";
        }

        if (backgroundPhoto && profile.profileImage) {
            backgroundPhoto.src = profile.profileImage;
        }

        if (backgroundProfession) {
            backgroundProfession.textContent =
                profile.professionalTitle || "Student / Aspiring Developer";
        }

        if (backgroundEmail) {
            backgroundEmail.textContent = profile.email || "Not specified";
        }

        if (backgroundPhone) {
            backgroundPhone.textContent = profile.phone || "Not specified";
        }

        if (backgroundLocation) {
            backgroundLocation.textContent = profile.location || "Not specified";
        }
        if (backgroundCountry) {
            backgroundCountry.textContent = profile.country || "Not specified";
        }


        console.log("Public profile loaded successfully!");

    } catch (error) {

        console.error("Public profile loading error:", error);

    }

}


// ==========================================
// RUN PROFILE LOADER
// ==========================================

loadPublicProfile();