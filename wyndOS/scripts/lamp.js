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

function toggleCRT() {
    document.body.classList.toggle("crt");
    localStorage.setItem("crtEnabled", document.body.classList.contains("crt"));
    
    if (!document.body.classList.contains("muted")) {
    const audio = new Audio("/audio/degauss.mp3");
    audio.volume = 0.2;
    audio.playbackRate = 2;
    audio.play();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("crtEnabled") === "true") {
        document.body.classList.add("crt");
    }
});

document.getElementById("crtToggleBtn").addEventListener("click", toggleCRT);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
    

    if (!document.body.classList.contains("muted")) {
        const audio = new Audio("/audio/fullscreen.mp3");
        audio.volume = 0.4;
        audio.playbackRate = 1.3;
        audio.play();
    }
}


const button = document.getElementById("fullscreenBtn");
if (button) {
    button.onclick = toggleFullScreen;
}
