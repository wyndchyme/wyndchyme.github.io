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

    if (menu.style.display === "block") {
        hideMenu();
    } else {
        menu.style.display = "block";
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
    }
}

document.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) { // Only register single-finger touches
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
            document.dispatchEvent(simulatedEvent); // Trigger rightClick event
        }, 1000); // 1-second hold to trigger
    }
});

document.addEventListener("touchmove", function (e) {
    if (touchTimer) {
        let touch = e.touches[0];
        let moveX = Math.abs(touch.pageX - touchStartX);
        let moveY = Math.abs(touch.pageY - touchStartY);

        if (moveX > 5 || moveY > 5) { // Cancel if movement exceeds 5px
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
