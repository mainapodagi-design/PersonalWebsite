// ==========================================
// FIREBASE PORTFOLIO CONNECTION
// ==========================================

// Import Firebase database
import { db } from "./firebase.js";

// Import Firestore functions
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";


// ==========================================
// GET PROJECT CONTAINER
// ==========================================

const projectContainer = document.getElementById("dynamicProjects");


// ==========================================
// IMAGE PATH HANDLER
// ==========================================

function getProjectImagePath(imagePath) {

    if (typeof imagePath !== "string" || !imagePath.trim()) {
        return null;
    }

    const cleanPath = imagePath.trim();

    // Allow full HTTP and HTTPS image URLs
    if (/^https?:\/\//i.test(cleanPath)) {
        return cleanPath;
    }

    // Allow GitHub project image paths
    // Example: ../IMAGES/PROJECTS/football-app.jpg

    if (
        cleanPath.startsWith("../IMAGES/") ||
        cleanPath.startsWith("./IMAGES/") ||
        cleanPath.startsWith("IMAGES/")
    ) {
        return new URL(cleanPath, document.baseURI).href;
    }

    // Reject unsupported paths
    return null;
}


// ==========================================
// LOAD PROJECTS FROM FIRESTORE
// ==========================================

async function loadPortfolioProjects() {

    try {

        if (!projectContainer) {
            console.error("Project container not found.");
            return;
        }

        projectContainer.textContent = "Loading my projects...";

        // Get projects collection
        const projectsRef = collection(db, "projects");

        // Retrieve projects
        const snapshot = await getDocs(projectsRef);

        // Clear loading message
        projectContainer.replaceChildren();

        // Check if projects exist
        if (snapshot.empty) {

            projectContainer.textContent =
                "No projects available at the moment.";

            return;
        }


        // ==================================
        // DISPLAY PROJECT CARDS
        // ==================================

        snapshot.forEach((projectDocument) => {

            const project = projectDocument.data();

            // Main project card
            const card = document.createElement("article");
            card.className = "project-card";


            // ==================================
            // PROJECT IMAGE
            // ==================================

            const imageContainer = document.createElement("div");
            imageContainer.className = "project-image";

            // Get image path
            const imagePath = getProjectImagePath(project.image);

            if (imagePath) {

                const image = document.createElement("img");

                image.src = imagePath;
                image.alt = project.name || "Portfolio project";
                image.loading = "lazy";

                // Show placeholder if image cannot load
                image.onerror = function () {

                    const placeholder = document.createElement("div");

                    placeholder.className = "project-image-placeholder";
                    placeholder.textContent = "PROJECT";

                    imageContainer.replaceChildren(placeholder);

                };

                imageContainer.appendChild(image);

            } else {

                const placeholder = document.createElement("div");

                placeholder.className = "project-image-placeholder";
                placeholder.textContent = "PROJECT";

                imageContainer.appendChild(placeholder);

            }


            // ==================================
            // PROJECT INFORMATION
            // ==================================

            const information = document.createElement("div");
            information.className = "project-info";


            // Project category
            const category = document.createElement("span");

            category.className = "project-category";

            category.textContent =
                project.category || "PERSONAL PROJECT";


            // Project title
            const title = document.createElement("h3");

            title.textContent =
                project.name || "Untitled Project";


            // Project description
            const description = document.createElement("p");

            description.textContent =
                project.description || "No description available.";


            // Project technologies
            const tags = document.createElement("div");

            tags.className = "project-tags";

            const technologyList = (project.technologies || "")
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);

            technologyList.forEach((technology) => {

                const tag = document.createElement("span");

                tag.textContent = technology;

                tags.appendChild(tag);

            });


            // Add project information
            information.append(category, title, description, tags);


            // ==================================
            // PROJECT LINK
            // ==================================

            if (project.link) {

                try {

                    const url = new URL(project.link);

                    if (
                        url.protocol === "https:" ||
                        url.protocol === "http:"
                    ) {

                        const link = document.createElement("a");

                        link.href = url.href;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";

                        link.className = "project-link";

                        link.textContent = "View Project ";

                        const arrow = document.createElement("i");

                        arrow.className = "fas fa-arrow-right";

                        link.appendChild(arrow);

                        information.appendChild(link);

                    }

                } catch (error) {

                    console.warn("Invalid project link:", project.link);

                }

            }


            // ==================================
            // ASSEMBLE PROJECT CARD
            // ==================================

            card.append(imageContainer, information);

            projectContainer.appendChild(card);

        });

    } catch (error) {

        console.error("Firebase portfolio error:", error);

        projectContainer.textContent =
            "Unable to load projects. Please try again later.";

    }

}


// ==========================================
// START PORTFOLIO
// ==========================================

loadPortfolioProjects();
