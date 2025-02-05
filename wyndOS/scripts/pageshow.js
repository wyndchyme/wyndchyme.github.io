window.addEventListener('pageshow', () => {
    document.documentElement.style.height = 'auto';
    requestAnimationFrame(() => {
      document.documentElement.style.height = '';
    });
  });  