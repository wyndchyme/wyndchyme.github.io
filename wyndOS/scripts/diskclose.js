document.addEventListener('DOMContentLoaded', () => {
    const diskDiv = document.getElementById('diskDiv');
    const closeButton = document.getElementById('diskToolbarClose');

    closeButton.addEventListener('click', () => {
        // Add the "wait-cursor" class to indicate the action
        document.body.classList.add('wait-cursor');

        // Add a 0.1s delay before hiding the qstDiv
        setTimeout(() => {
            diskDiv.style.display = 'none';

            // Remove the "wait-cursor" class after the action
            document.body.classList.remove('wait-cursor');
        }, 100);  // 100ms delay
    });
});