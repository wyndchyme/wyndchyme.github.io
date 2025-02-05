document.onclick = hideMenu;
document.oncontextmenu = rightClick;

let touchTimer = null;
let touchStartX = 0;
let touchStartY = 0;

function hideMenu() {
    document.getElementById("contextMenu").style.display = "none";
}

function rightClick(e) {
    e.preventDefault();

    let menu = document.getElementById("contextMenu");
    let viewportMidpoint = window.innerHeight / 2; 

    if (menu.style.display === "block") {
        hideMenu();
    } else {
        menu.style.display = "block";

        let menuX = e.pageX;
        let menuY = e.pageY;

        
        if (e.pageY < viewportMidpoint) {
            menu.style.top = `${menuY}px`;
        } else {
            let menuHeight = menu.offsetHeight || 100; 
            menu.style.top = `${menuY - menuHeight}px`;
        }

  
        menu.style.left = `${menuX}px`;
    }
}


document.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) { 
        let touch = e.touches[0];
        touchStartX = touch.pageX;
        touchStartY = touch.pageY;

        touchTimer = setTimeout(() => {
            let simulatedEvent = new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: touchStartX,
                clientY: touchStartY,
                pageX: touchStartX,
                pageY: touchStartY
            });
            document.dispatchEvent(simulatedEvent); 
        }, 500); 
    }
});

document.addEventListener("touchmove", function (e) {
    if (touchTimer) {
        let touch = e.touches[0];
        let moveX = Math.abs(touch.pageX - touchStartX);
        let moveY = Math.abs(touch.pageY - touchStartY);

        if (moveX > 5 || moveY > 5) { 
            clearTimeout(touchTimer);
            touchTimer = null;
        }
    }
});

document.addEventListener("touchend", function () {
    if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
});
