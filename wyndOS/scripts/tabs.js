function openTab(tabName, button) {
    document.body.classList.add('wait-cursor');
    setTimeout(function () {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.style.display = 'none');

    // Show the selected tab
    document.getElementById(tabName).style.display = 'block';

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tabbed');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add active class to the clicked button
    button.classList.add('active');
    // Remove the wait cursor class
    document.body.classList.remove('wait-cursor');
        }, 50); // Delay in milliseconds (0.1s)
}

// Make the "London" tab active by default
window.onload = function() {
    openTab('London', document.querySelector('.tabbed'));
};