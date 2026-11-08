
/* =========================================
   FIREBASE ADMIN DASHBOARD
========================================= */

// Import Firebase connections
import { auth, db } from "./firebase.js";

// Import authentication functions
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

// Import Firestore functions
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";


/* =========================================
   ADMINISTRATOR CONFIGURATION
========================================= */

// Replace this with your actual Firebase administrator UID
const ADMIN_UID = "LHA75qYACFOqw6hCUDRXm9h1dqT2";


/* =========================================
   GET HTML ELEMENTS
========================================= */

const logoutButton = document.getElementById("logoutButton");

const projectForm = document.getElementById("projectForm");
const projectId = document.getElementById("projectId");

const projectName = document.getElementById("projectName");
const projectDescription = document.getElementById("projectDescription");
const projectTechnologies = document.getElementById("projectTechnologies");
const projectLink = document.getElementById("projectLink");

const projectList = document.getElementById("projectList");
const projectCount = document.getElementById("projectCount");
const messageCount = document.getElementById("messageCount");

const statusMessage = document.getElementById("statusMessage");
const saveProjectButton = document.getElementById("saveProjectButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const projectFormTitle = document.getElementById("projectFormTitle");


/* =========================================
   NAVIGATION BETWEEN DASHBOARD SECTIONS
========================================= */

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("pageTitle");

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        const targetSection = link.dataset.section;

        navLinks.forEach((item) => {
            item.classList.remove("active");
        });

        sections.forEach((section) => {
            section.classList.remove("active");
        });

        link.classList.add("active");

        document.getElementById(targetSection).classList.add("active");

        pageTitle.textContent = link.textContent.trim().replace(/^[◈▣◉✉]\s*/, "");

        if (targetSection === "projects") {
            loadProjects();
        }

    });

});


/* =========================================
   AUTHENTICATION AND ADMIN CHECK
========================================= */

let dashboardStarted = false;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.replace("login.html");
        return;

    }

    // Check that the signed-in user is the authorised administrator
    if (user.uid !== ADMIN_UID) {

        await signOut(auth);
        window.location.replace("login.html");
        return;

    }

    // Start dashboard only once
    if (!dashboardStarted) {

        dashboardStarted = true;

        console.log("Administrator authenticated:", user.email);

        await loadProjects();
        await loadMessageCount();

    }

});


/* =========================================
   LOAD PROJECTS FROM FIRESTORE
========================================= */

async function loadProjects() {

    projectList.textContent = "Loading projects...";

    try {

        const projectsRef = collection(db, "projects");

        const snapshot = await getDocs(projectsRef);

        projectList.replaceChildren();

        projectCount.textContent = snapshot.size;

        if (snapshot.empty) {

            projectList.textContent = "No projects added yet.";

            return;

        }

        snapshot.forEach((projectDocument) => {

            const project = projectDocument.data();

            // Create project card safely
            const card = document.createElement("div");
            card.className = "project-item";

            const title = document.createElement("h3");
            title.textContent = project.name || "Untitled project";

            const description = document.createElement("p");
            description.textContent = project.description || "";

            const technologies = document.createElement("p");
            technologies.textContent =
                "Technologies: " + (project.technologies || "Not specified");

            const actions = document.createElement("div");
            actions.className = "project-actions";

            const editButton = document.createElement("button");
            editButton.className = "edit-button";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", () => {
                editProject(projectDocument.id, project);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {
                removeProject(projectDocument.id);
            });

            actions.append(editButton, deleteButton);

            card.append(title, description, technologies, actions);

            projectList.appendChild(card);

        });

    } catch (error) {

        console.error("Project loading error:", error);

        projectList.textContent =
            "Unable to load projects. Check your Firestore connection and rules.";

    }

}


/* =========================================
   ADD OR UPDATE PROJECT
========================================= */

projectForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const projectData = {

        name: projectName.value.trim(),

        description: projectDescription.value.trim(),

        technologies: projectTechnologies.value.trim(),

        link: projectLink.value.trim(),

        updatedAt: serverTimestamp()

    };

    if (!projectData.name || !projectData.description) {

        statusMessage.textContent =
            "Please enter the project name and description.";

        return;

    }

    saveProjectButton.disabled = true;
    saveProjectButton.textContent = "Saving...";

    try {

        if (projectId.value) {

            // Update an existing project
            await updateDoc(
                doc(db, "projects", projectId.value),
                projectData
            );

            statusMessage.textContent = "Project updated successfully!";

        } else {

            // Add a new project
            projectData.createdAt = serverTimestamp();

            await addDoc(collection(db, "projects"), projectData);

            statusMessage.textContent = "Project added successfully!";

        }

        projectForm.reset();
        projectId.value = "";

        projectFormTitle.textContent = "Add New Project";
        saveProjectButton.textContent = "Save Project";
        cancelEditButton.hidden = true;

        await loadProjects();

    } catch (error) {

        console.error("Project saving error:", error);

        statusMessage.textContent =
            "Unable to save project. Check your Firestore rules.";

    } finally {

        saveProjectButton.disabled = false;

        if (!projectId.value) {
            saveProjectButton.textContent = "Save Project";
        }

    }

});


/* =========================================
   EDIT PROJECT
========================================= */

function editProject(id, project) {

    projectId.value = id;

    projectName.value = project.name || "";

    projectDescription.value = project.description || "";

    projectTechnologies.value = project.technologies || "";

    projectLink.value = project.link || "";

    projectFormTitle.textContent = "Edit Project";

    saveProjectButton.textContent = "Update Project";

    cancelEditButton.hidden = false;

    projectForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   CANCEL PROJECT EDIT
========================================= */

cancelEditButton.addEventListener("click", () => {

    projectForm.reset();

    projectId.value = "";

    projectFormTitle.textContent = "Add New Project";

    saveProjectButton.textContent = "Save Project";

    cancelEditButton.hidden = true;

    statusMessage.textContent = "";

});


/* =========================================
   DELETE PROJECT
========================================= */

async function removeProject(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await deleteDoc(doc(db, "projects", id));

        alert("Project deleted successfully!");

        await loadProjects();

    } catch (error) {

        console.error("Project deletion error:", error);

        alert("Unable to delete project.");

    }

}


/* =========================================
   LOAD MESSAGE COUNT
========================================= */

async function loadMessageCount() {

    try {

        const snapshot = await getDocs(collection(db, "messages"));

        messageCount.textContent = snapshot.size;

    } catch (error) {

        console.error("Message count error:", error);

        messageCount.textContent = "—";

    }

}


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.replace("login.html");

    } catch (error) {

        console.error("Logout error:", error);

        alert("Unable to log out. Please try again.");

    }

});
