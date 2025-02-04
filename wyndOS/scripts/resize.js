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