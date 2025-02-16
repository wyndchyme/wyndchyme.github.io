// Load the saved theme from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        if (savedTheme === "dark-mode") {
            applyDarkBackground();
        }
    }
});

// Function to apply dark mode background with transition
function applyDarkBackground() {
    document.documentElement.style.transition = "background 0.5s ease-in-out";
    document.documentElement.style.background = "url('/images/background/moroccan-flower-dark.png')";
}

// Function to apply light mode background with transition
function applyLightBackground() {
    document.documentElement.style.transition = "background 0.5s ease-in-out";
    document.documentElement.style.background = "url('/images/background/moroccan-flower.png')";
}

// Function to toggle theme and play sound
function toggleLamp() {
    const element = document.body;
    const lampSound = document.getElementById("lampSound");

    // Play the sound
    lampSound.play();

    // Toggle the theme
    if (element.classList.contains("dark-mode")) {
        element.classList.remove("dark-mode");
        applyLightBackground();
        localStorage.setItem("theme", ""); // Save empty to reset
    } else {
        element.classList.add("dark-mode");
        applyDarkBackground();
        localStorage.setItem("theme", "dark-mode");
    }
}