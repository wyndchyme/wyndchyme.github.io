document.querySelectorAll("button, a").forEach(element => {
    element.addEventListener("mouseenter", () => {
      const sound = new Audio("/audio/hover.mp3");
      sound.volume = 0.25;
      sound.play();
    });
  });