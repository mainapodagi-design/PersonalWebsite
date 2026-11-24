
// ==========================================
// EMAILJS CONTACT FORM CONNECTION
// ==========================================

// Initialize EmailJS
emailjs.init({
    publicKey: "X4Y2t7IN3OIKrWcvL"
});

// Get contact form elements
const contactForm = document.getElementById("contactForm");
const response = document.getElementById("form-response");
const submitButton = document.getElementById("submitBtn");

// Listen for form submission
contactForm.addEventListener("submit", async function(event) {

    // Prevent page refresh
    event.preventDefault();

    // Prevent multiple submissions
    submitButton.disabled = true;

    submitButton.innerHTML =
        'Sending... <i class="fas fa-spinner fa-spin"></i>';

    response.textContent = "Sending your message...";
    response.style.color = "#3498db";

    try {

        // Send message through EmailJS
        await emailjs.sendForm(
            "service_bp2dwi8",
            "template_qtv4hqo",
            contactForm
        );

        // Success message
        response.textContent =
            "Thank you! Your message has been sent successfully.";

        response.style.color = "#35d07f";

        // Clear form
        contactForm.reset();

    } catch (error) {

        console.error("EmailJS Error:", error);

        response.textContent =
            "Sorry, your message could not be sent. Please try again.";

        response.style.color = "#ff5555";

    } finally {

        // Restore submit button
        submitButton.disabled = false;

        submitButton.innerHTML =
            'Send Message <i class="fas fa-paper-plane"></i>';

    }

});
