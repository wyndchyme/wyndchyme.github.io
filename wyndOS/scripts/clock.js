function updateClock() {
    const clockElement = document.querySelector('.tbclock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the clock immediately and set an interval to update it every second
updateClock();
setInterval(updateClock, 1000);