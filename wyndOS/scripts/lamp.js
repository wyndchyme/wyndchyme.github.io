// Load the saved theme from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
});

// Function to toggle theme and play sound
function toggleLamp() {
    const element = document.body;
    const lampSound = document.getElementById("lampSound");

    // Play the sound
    lampSound.play();

    // Toggle the theme
    if (element.classList.contains("dark-mode")) {
        element.classList.remove("dark-mode");
        localStorage.setItem("theme", ""); // Save empty to reset
    } else {
        element.classList.add("dark-mode");
        localStorage.setItem("theme", "dark-mode");
    }
}