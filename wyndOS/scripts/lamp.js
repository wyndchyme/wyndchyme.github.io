document.addEventListener("DOMContentLoaded", () => {

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
});


function toggleLamp() {
    const element = document.body;
    const lampSound = document.getElementById("lampSound");


    lampSound.volume = 0.6;


    lampSound.play();


    if (element.classList.contains("dark-mode")) {
        element.classList.remove("dark-mode");
        localStorage.setItem("theme", ""); 
    } else {
        element.classList.add("dark-mode");
        localStorage.setItem("theme", "dark-mode");
    }
}

