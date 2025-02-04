const windows = [
    { id: "aboutDiv", toolbarId: "aboutToolbarIcon" },
    { id: "diskDiv", toolbarId: "diskToolbarIcon" },
    { id: "qstDiv", toolbarId: "qstToolbarIcon" }
];

function updateToolbarVisibility() {
        windows.forEach(win => {
            const windowEl = document.getElementById(win.id);
            const toolbarEl = document.getElementById(win.toolbarId);

            if (windowEl.style.display === "block") {
                toolbarEl.style.display = "block"; 
            } else {
                toolbarEl.style.display = "none"; 
            }
        });
    }



setInterval(updateToolbarVisibility, 500);
