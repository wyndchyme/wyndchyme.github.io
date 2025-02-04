if (
    /Macintosh/.test(navigator.userAgent) && // Check if it's a Mac (Safari is mostly used here)
    /Safari/.test(navigator.userAgent) && // Check if it's Safari
    !/Chrome/.test(navigator.userAgent) // Exclude Chrome (which also uses WebKit)
  ) {
      document.body.classList.add('desktop-safari');
  }