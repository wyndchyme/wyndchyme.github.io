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

document.addEventListener('DOMContentLoaded', () => {
    const updatesDiv = document.getElementById('updatesDiv');
    const closeButtons = document.querySelectorAll('#notesToolbarClose, #notesClose'); // Select both buttons

    const updatesVersion = "113"; 


    const seenVersion = localStorage.getItem("updates_seen");

    if (seenVersion !== updatesVersion) {

        updatesDiv.style.display = 'block';

        const thirtyFiveVW = window.innerWidth * 0.35;

        const leftValue = thirtyFiveVW <= 250 ? `calc(50vw - 125px)` : `calc(50vw - 17.5vw)`;

        updatesDiv.style.left = leftValue;
        updatesDiv.style.top = `calc(50vh - 22.5vh)`;
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.classList.add('wait-cursor');

            setTimeout(() => {
                updatesDiv.style.display = 'none';
                document.body.classList.remove('wait-cursor');

                localStorage.setItem("updates_seen", updatesVersion);
            }, 113);
        });
    });
});

