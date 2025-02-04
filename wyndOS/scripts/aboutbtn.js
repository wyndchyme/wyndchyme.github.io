document.getElementById('aboutButton').addEventListener('click', function () {
    var div = document.getElementById('aboutDiv');
    if (div.style.display === 'none') {
        // Add the wait cursor class to the body
        document.body.classList.add('wait-cursor');
        
        setTimeout(function () {
            div.style.display = 'block';
            div.style.left = `calc(50vw - 150px)`;
            div.style.top = `calc(25vh)`;

            // Remove the wait cursor class
            document.body.classList.remove('wait-cursor');
        }, 100); // Delay in milliseconds (0.1s)
    } else {
        div.style.display = 'block';
    }
});