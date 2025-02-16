// Global z-index counter
let currentZIndex = 1;
function bringElementToFront(el) {
  el.style.zIndex = ++currentZIndex;
}

/* DRAGGABLE ELEMENTS & WINDOW-STYLE DIVS */
const draggableElements = document.querySelectorAll('.draggable');
const zoomFactor = parseFloat(getComputedStyle(document.body).zoom) || 115;

draggableElements.forEach(el => {
  const header = el.querySelector('.header');

  el.addEventListener('click', () => bringElementToFront(el));
  el.addEventListener('touchstart', () => bringElementToFront(el), { passive: true });

  function startDrag(event) {
    hideMenu(); // Hacky fix: hide the context menu when dragging starts
    bringElementToFront(el);
    let shiftX, shiftY;
    if (event.type === 'mousedown') {
      shiftX = (event.clientX - el.getBoundingClientRect().left) / zoomFactor;
      shiftY = (event.clientY - el.getBoundingClientRect().top) / zoomFactor;
    } else if (event.type === 'touchstart') {
      const touch = event.touches[0];
      shiftX = (touch.clientX - el.getBoundingClientRect().left) / zoomFactor;
      shiftY = (touch.clientY - el.getBoundingClientRect().top) / zoomFactor;
    }
    function moveAt(pageX, pageY) {
      let newLeft = (pageX / zoomFactor) - shiftX;
      let newTop = (pageY / zoomFactor) - shiftY;
      const minTop = 20;
      let maxTop;
      if (el.id === 'qstDiv') {
        maxTop = (window.innerHeight - el.offsetHeight) / zoomFactor - 150;
      } else {
        maxTop = (window.innerHeight - el.offsetHeight) / zoomFactor - 80;
      }
      newTop = Math.max(minTop, Math.min(maxTop, newTop));
      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
    }
    function onMove(event) {
      if (event.type === 'mousemove') {
        moveAt(event.pageX, event.pageY);
      } else if (event.type === 'touchmove') {
        const touch = event.touches[0];
        moveAt(touch.clientX, touch.clientY);
      }
    }
    function endDrag() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }

  header.addEventListener('mousedown', startDrag);
  header.addEventListener('touchstart', startDrag, { passive: false });
  el.ondragstart = () => false;
});

/* WINDOW-STYLE DIV INTERACTION VIA TOOLBAR BUTTONS */
const aboutButton = document.getElementById('aboutButton');
const diskButton = document.getElementById('diskButton');
const qstButton = document.getElementById('qstButton');
const notesButton = document.getElementById('notesButton');
const optionsButton = document.getElementById('optionsButton');
const aboutButton2 = document.getElementById('aboutButton2');
const diskButton2 = document.getElementById('diskButton2');
const qstButton2 = document.getElementById('qstButton2');
const notesButton2 = document.getElementById('notesButton2');
const aboutButton3 = document.getElementById('aboutButton3');
const diskButton3 = document.getElementById('diskButton3');
const aboutToolbarButton = document.getElementById('aboutToolbarButton');
const diskToolbarButton = document.getElementById('diskToolbarButton');
const qstToolbarButton = document.getElementById('qstToolbarButton');

const aboutDiv = document.getElementById('aboutDiv');
const diskDiv = document.getElementById('diskDiv');
const qstDiv = document.getElementById('qstDiv');
const updatesDiv = document.getElementById('updatesDiv');
const optionsDiv = document.getElementById('optionsDiv');

[aboutButton, aboutButton2, aboutButton3, aboutToolbarButton].forEach(btn =>
  btn?.addEventListener('click', () => bringElementToFront(aboutDiv))
);
[diskButton, diskButton2, diskButton3, diskToolbarButton].forEach(btn =>
  btn?.addEventListener('click', () => bringElementToFront(diskDiv))
);
[qstButton, qstButton2, qstToolbarButton].forEach(btn =>
  btn?.addEventListener('click', () => bringElementToFront(qstDiv))
);
[notesButton, notesButton2, notesToolbarButton].forEach(btn =>
  btn?.addEventListener('click', () => bringElementToFront(updatesDiv))
);
[optionsButton].forEach(btn =>
  btn?.addEventListener('click', () => bringElementToFront(optionsDiv))
);

let lastWidth = window.innerWidth;
window.addEventListener("resize", () => {
  let currentWidth = window.innerWidth;
  if (
    (lastWidth < 1000 && currentWidth >= 1000) ||
    (lastWidth >= 1000 && currentWidth < 1000) ||
    (lastWidth < 1200 && currentWidth >= 1200) ||
    (lastWidth >= 1200 && currentWidth < 1200)
  ) {
    document.body.style.display = "none";
    setTimeout(() => {
      document.body.style.display = "block";
    }, 0);
  }
  lastWidth = currentWidth;
});

/* CONTEXT MENU */
let lastContextMenuTime = 0;

// Use an event listener with a debounce for clicks
document.addEventListener("click", (e) => {
  // If a click happens within 600ms of opening the menu, ignore it.
  if (Date.now() - lastContextMenuTime < 600) return;
  hideMenu();
});

document.oncontextmenu = rightClick;

function hideMenu() {
  document.getElementById("contextMenu").style.display = "none";
}

function rightClick(e) {
  e.preventDefault();
  const draggableTarget = e.target.closest('.draggable');
  if (draggableTarget) {
    bringElementToFront(draggableTarget);
  }
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
    // Record the time when the context menu was opened.
    lastContextMenuTime = Date.now();
  }
}

let touchTimer = null;
let touchStartX = 0;
let touchStartY = 0;

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
