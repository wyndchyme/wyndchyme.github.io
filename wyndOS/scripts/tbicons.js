const windows = [
    { id: "aboutDiv", toolbarId: "aboutToolbarIcon" },
    { id: "diskDiv", toolbarId: "diskToolbarIcon" },
    { id: "qstDiv", toolbarId: "qstToolbarIcon" },
    { id: "updatesDiv", toolbarId: "notesToolbarIcon" },
];

const toolbarIconsContainer = document.getElementById("toolbarIconsContainer");
let openOrder = [];

function updateToolbarOrder() {
    openOrder.sort((a, b) => a.timestamp - b.timestamp);
    openOrder.forEach(icon => toolbarIconsContainer.appendChild(icon.element));
}

function handleWindowChange(id) {
    const win = windows.find(w => w.id === id);
    const windowEl = document.getElementById(win.id);
    const toolbarEl = document.getElementById(win.toolbarId);

    if (!windowEl || !toolbarEl) return;

    if (windowEl.style.display === "block") {
        let existing = openOrder.find(item => item.element === toolbarEl);
        if (existing) {
            existing.timestamp = Date.now();
        } else {
            openOrder.push({ element: toolbarEl, timestamp: Date.now() });
        }
        toolbarEl.style.display = "block";
    } else {
        openOrder = openOrder.filter(item => item.element !== toolbarEl);
        toolbarEl.style.display = "none";
    }

    updateToolbarOrder();
}

windows.forEach(win => {
    const windowEl = document.getElementById(win.id);
    if (windowEl) {
        const observer = new MutationObserver(() => handleWindowChange(win.id));
        observer.observe(windowEl, { attributes: true, attributeFilter: ['style'] });
    }
});
