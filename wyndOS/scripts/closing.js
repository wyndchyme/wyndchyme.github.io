const draggable = document.querySelector('.draggable');
const header = draggable.querySelector('.header');
const closeButton = draggable.querySelector('.close-btn');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const closeButtons = document.querySelectorAll('.draggable .close-btn');

closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        
        const div = closeButton.closest('.draggable');
        
        
        document.body.classList.add('wait-cursor');

        
        setTimeout(() => {
            if (div.style.display === 'none') {
                div.style.display = 'block';
            } else {
                div.style.display = 'none';
            }

            
            document.body.classList.remove('wait-cursor');
        }, 75); 
    });
});