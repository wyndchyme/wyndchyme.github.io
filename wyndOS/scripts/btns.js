document.addEventListener('DOMContentLoaded', () => {
    const aboutDiv = document.getElementById('aboutDiv');
    const closeButton = document.getElementById('aboutToolbarClose');

    closeButton.addEventListener('click', () => {
        // Add the "wait-cursor" class to indicate the action
        document.body.classList.add('wait-cursor');

        // Add a 0.1s delay before hiding the qstDiv
        setTimeout(() => {
            aboutDiv.style.display = 'none';

            // Remove the "wait-cursor" class after the action
            document.body.classList.remove('wait-cursor');
        }, 100);  // 100ms delay
    });
});

document.getElementById('diskButton').addEventListener('click', function () {
    var div = document.getElementById('diskDiv');
    if (div.style.display === 'none') {
        // Add the wait cursor class to the body
        document.body.classList.add('wait-cursor');
        
        setTimeout(function () {
            div.style.display = 'block';
            div.style.left = `calc(50vw - 150px)`;
            div.style.top = `calc(25vh)`;

            // Remove the wait cursor class
            document.body.classList.remove('wait-cursor');
        }, 200); // Delay in milliseconds (0.1s)
    } else {
        div.style.display = 'block';
    }
});

    document.getElementById('diskButton2').addEventListener('click', function () {
        var div = document.getElementById('diskDiv');
        if (div.style.display === 'none') {
            // Add the wait cursor class to the body
            document.body.classList.add('wait-cursor');
            
            setTimeout(function () {
                div.style.display = 'block';
                div.style.left = `calc(50vw - 150px)`;
                div.style.top = `calc(25vh)`;
    
                // Remove the wait cursor class
                document.body.classList.remove('wait-cursor');
            }, 200); // Delay in milliseconds (0.1s)
        } else {
            div.style.display = 'block';
        }
    });

    document.getElementById('diskButton3').addEventListener('click', function () {
        var div = document.getElementById('diskDiv');
        if (div.style.display === 'none') {
            // Add the wait cursor class to the body
            document.body.classList.add('wait-cursor');
            
            setTimeout(function () {
                div.style.display = 'block';
                div.style.left = `calc(50vw - 150px)`;
                div.style.top = `calc(25vh)`;
    
                // Remove the wait cursor class
                document.body.classList.remove('wait-cursor');
            }, 200); // Delay in milliseconds (0.1s)
        } else {
            div.style.display = 'block';
        }
    });

document.getElementById('qstButton').addEventListener('click', function () {
    var div = document.getElementById('qstDiv');
    if (div.style.display === 'none') {
        // Add the wait cursor class to the body
        document.body.classList.add('wait-cursor');
        
        setTimeout(function () {
            div.style.display = 'block';
            div.style.left = `calc(50vw - 150px)`;
            div.style.top = `calc(25vh)`;

            // Remove the wait cursor class
            document.body.classList.remove('wait-cursor');
        }, 250); // Delay in milliseconds (0.1s)
    } else {
        div.style.display = 'block';
    }
});

    document.getElementById('qstButton2').addEventListener('click', function () {
        var div = document.getElementById('qstDiv');
        if (div.style.display === 'none') {
            // Add the wait cursor class to the body
            document.body.classList.add('wait-cursor');
            
            setTimeout(function () {
                div.style.display = 'block';
                div.style.left = `calc(50vw - 150px)`;
                div.style.top = `calc(25vh)`;
    
                // Remove the wait cursor class
                document.body.classList.remove('wait-cursor');
            }, 250); // Delay in milliseconds (0.1s)
        } else {
            div.style.display = 'block';
        }
    });

    document.getElementById('notesButton').addEventListener('click', function () {
        var div = document.getElementById('updatesDiv');
        if (div.style.display === 'none') {
            // Add the wait cursor class to the body
            document.body.classList.add('wait-cursor');
            
            setTimeout(function () {
                div.style.display = 'block';
                div.style.left = `calc(50vw - 150px)`;
                div.style.top = `calc(25vh)`;
    
                // Remove the wait cursor class
                document.body.classList.remove('wait-cursor');
            }, 250); // Delay in milliseconds (0.1s)
        } else {
            div.style.display = 'block';
        }
    });

    document.getElementById('notesButton2').addEventListener('click', function () {
        var div = document.getElementById('updatesDiv');
        if (div.style.display === 'none') {
            // Add the wait cursor class to the body
            document.body.classList.add('wait-cursor');
            
            setTimeout(function () {
                div.style.display = 'block';
                div.style.left = `calc(50vw - 150px)`;
                div.style.top = `calc(25vh)`;
    
                // Remove the wait cursor class
                document.body.classList.remove('wait-cursor');
            }, 250); // Delay in milliseconds (0.1s)
        } else {
            div.style.display = 'block';
        }
    });
    