document.addEventListener('DOMContentLoaded', function () {

    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioToggleBtn2 = document.getElementById('audioToggleBtn2');
    const audioToggleBtnStart = document.getElementById('audioToggleBtnStart');
    const body = document.body;


    let isMuted = localStorage.getItem('audioMuted') === 'true';

    function updateAudioState(muted) {
        document.querySelectorAll('audio, video').forEach(audio => {
            audio.muted = muted;
        });
        body.classList.toggle('muted', muted);
    }

    function toggleAudio() {
        isMuted = !isMuted;
        localStorage.setItem('audioMuted', isMuted);
        updateAudioState(isMuted);
    }


    updateAudioState(isMuted);


    if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAudio);
    if (audioToggleBtn2) audioToggleBtn2.addEventListener('click', toggleAudio);
    if (audioToggleBtnStart) audioToggleBtnStart.addEventListener('click', toggleAudio);


    document.querySelectorAll("button, a").forEach(element => {
        element.addEventListener("mouseenter", () => {
            if (document.body.classList.contains("muted")) return;
            
            const sound = new Audio("/audio/hover.mp3");
            sound.volume = 0.3;
            sound.play();
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const soundSrc = "/audio/click.mp3";
    
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", (event) => {
            if (document.body.classList.contains("muted")) return;
            
            const clickSound = new Audio(soundSrc);
            clickSound.volume = 0.75;
            clickSound.play();
        });
    });
});
