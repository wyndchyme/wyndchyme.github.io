window.addEventListener('pageshow', () => {
    document.documentElement.style.display = 'none';
    requestAnimationFrame(() => {
      document.documentElement.style.display = '';
    });
  });
  