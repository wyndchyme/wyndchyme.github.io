const startButton = document.getElementById("startButton");
    const startMenu = document.getElementById("startMenu");
    const draggableWindows = document.querySelectorAll(".draggable");
    const toolbar = document.querySelectorAll(".toolbar");
    
    toolbar.forEach(item => {
        item.style.zIndex = "999";
    });
    
    function repaintBackground() {
        const bgPosition = getComputedStyle(document.body).backgroundPosition;
        document.body.style.backgroundPosition = bgPosition;
    }
    
    startButton.addEventListener("click", function (event) {
        event.stopPropagation(); 
    

        const bgBefore = getComputedStyle(document.body).backgroundPosition;
    
        if (startMenu.style.display === "block") {
            startMenu.style.display = "none";
        } else {
            startMenu.style.display = "block";
            startMenu.style.zIndex = "100";
        }
    
        
        setTimeout(() => {
            document.body.style.backgroundPosition = bgBefore;
        }, 0);
    });
    
    
    document.addEventListener("click", function () {
        startMenu.style.display = "none";
    });
    
    
    startMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });
    
    
    draggableWindows.forEach(window => {
        function bringToFront() {
            this.style.zIndex = "200";
            startMenu.style.zIndex = "50";
            startMenu.style.display = "none";
            repaintBackground(); 
        }
    
        function hideStartMenu() {
            startMenu.style.display = "none";
            repaintBackground(); 
        }
    
        
        window.addEventListener("mousedown", bringToFront);
        window.addEventListener("dragstart", hideStartMenu);
    
        
        window.addEventListener("touchstart", bringToFront, { passive: true });
        window.addEventListener("touchmove", hideStartMenu, { passive: true });
    });