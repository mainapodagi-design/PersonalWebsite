
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
// LOAD PROJECTS FROM FIRESTORE
// ==========================================

async function loadPortfolioProjects() {

    try {

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


            // Project image container
            const imageContainer = document.createElement("div");
            imageContainer.className = "project-image";

            // Optional project image
            if (
                typeof project.image === "string" &&
                /^https:\/\//i.test(project.image)
            ) {

                const image = document.createElement("img");

                image.src = project.image;
                image.alt = project.name || "Portfolio project";

                imageContainer.appendChild(image);

            } else {

                const placeholder = document.createElement("div");

                placeholder.className = "project-image-placeholder";
                placeholder.textContent = "PROJECT";

                imageContainer.appendChild(placeholder);

            }


            // Project information container
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


            // Project link
            information.append(category, title, description, tags);


            // Only create a link when it is a valid HTTP(S) URL
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


            // Assemble complete project card
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
