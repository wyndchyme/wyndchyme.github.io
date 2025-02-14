document.addEventListener("DOMContentLoaded", function () {
    let clockButton = document.getElementById("clockButton");
    let cat = document.getElementById("catEasterEgg");

    clockButton.addEventListener("click", function () {
        if (!document.body.classList.contains("muted")) {
        let sound = new Audio("/audio/meow.mp3"); 
        sound.volume = 0.5;
        sound.playbackRate = 1.5;
        sound.play(); 
        }

        if (cat.style.display === "block") {
            cat.style.display = "none";
        } else {
            cat.style.display = "block";
            cat.style.animation = "fadeUp 0.5s ease-in-out";

            setTimeout(() => {
                cat.style.animation = "tabby 4s steps(1) infinite";
            }, 500);
        }
    });
});
