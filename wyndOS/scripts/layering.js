let currentZIndex = 1;
    

    const draggableElements = document.querySelectorAll('.draggable');
    
    
    const zoomFactor = parseFloat(getComputedStyle(document.body).zoom) || 115;
    
    draggableElements.forEach(el => {
      const header = el.querySelector('.header');
    

      function bringToFront() {
        el.style.zIndex = ++currentZIndex;
      }
    
      el.addEventListener('click', bringToFront);
      el.addEventListener('touchstart', bringToFront, { passive: true });
    
      function startDrag(event) {
        el.style.zIndex = ++currentZIndex;
    
        let shiftX, shiftY;
    
        // Handle mouse or touch events
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
    
    const aboutButton = document.getElementById('aboutButton');
    const diskButton = document.getElementById('diskButton');
    const qstButton = document.getElementById('qstButton');
    const notesButton = document.getElementById('notesButton');
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
    function bringToFront(div) {
      div.style.zIndex = ++currentZIndex;
    }
    
    [aboutButton, aboutButton2, aboutButton3, aboutToolbarButton].forEach(btn => btn?.addEventListener('click', () => bringToFront(aboutDiv)));
    [diskButton, diskButton2, diskButton3, diskToolbarButton].forEach(btn => btn?.addEventListener('click', () => bringToFront(diskDiv)));
    [qstButton, qstButton2, qstToolbarButton].forEach(btn => btn?.addEventListener('click', () => bringToFront(qstDiv)));
    [notesButton, notesButton2, notesToolbarButton].forEach(btn => btn?.addEventListener('click', () => bringToFront(updatesDiv)));
    
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