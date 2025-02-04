document.addEventListener('DOMContentLoaded', function () {
    // Select the buttons and body element
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioToggleBtnStart = document.getElementById('audioToggleBtnStart');
    const body = document.body;

    // Check localStorage for saved audio state
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

    // Initialize the audio state on page load
    updateAudioState(isMuted);

    // Attach event listeners to both buttons
    if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAudio);
    if (audioToggleBtnStart) audioToggleBtnStart.addEventListener('click', toggleAudio);
});