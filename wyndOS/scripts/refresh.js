function refreshPage() {
    document.body.classList.add("wait-cursor"); 
    setTimeout(function () {
        window.location.reload();
    }, 100);
}