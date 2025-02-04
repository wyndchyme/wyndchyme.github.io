document.addEventListener('DOMContentLoaded', () => {
    const qstDiv = document.getElementById('qstDiv');
    const closeButton = qstDiv.querySelector('.close-btn');

    closeButton.addEventListener('click', () => {
        // Add the "wait-cursor" class to indicate the action
        document.body.classList.add('wait-cursor');

        // Add a 0.1s delay before hiding the qstDiv
        setTimeout(() => {
            qstDiv.style.display = 'none';

            // Remove the "wait-cursor" class after the action
            document.body.classList.remove('wait-cursor');
        }, 250);  // 100ms delay
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const qstDiv = document.getElementById('qstDiv');
    const closeButton = document.getElementById('qstToolbarClose');

    closeButton.addEventListener('click', () => {
        // Add the "wait-cursor" class to indicate the action
        document.body.classList.add('wait-cursor');

        // Add a 0.1s delay before hiding the qstDiv
        setTimeout(() => {
            qstDiv.style.display = 'none';

            // Remove the "wait-cursor" class after the action
            document.body.classList.remove('wait-cursor');
        }, 250);  // 100ms delay
    });
});