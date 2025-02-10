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

document.addEventListener("DOMContentLoaded", function () {
    const wallpaperDecor = document.getElementById("wallpaperDecor");
    const colorBtn = document.getElementById("colorBtn");
    const colorClasses = ["color-transparent", "color-red", "color-orange", "color-yellow", "color-green", "color-purple"];
    

    let currentIndex = localStorage.getItem("wallpaperColorIndex");
    currentIndex = currentIndex ? parseInt(currentIndex) : 0;
    wallpaperDecor.classList.add(colorClasses[currentIndex]);

    colorBtn.addEventListener("click", function () {
        if (!document.body.classList.contains("muted")) {
        const clickSound = new Audio("/audio/paint.mp3"); 
        clickSound.volume = 0.7;
        clickSound.play();
        }
        
        wallpaperDecor.classList.remove(colorClasses[currentIndex]);
        currentIndex = (currentIndex + 1) % colorClasses.length;
        wallpaperDecor.classList.add(colorClasses[currentIndex]);
        localStorage.setItem("wallpaperColorIndex", currentIndex);
    });
});
