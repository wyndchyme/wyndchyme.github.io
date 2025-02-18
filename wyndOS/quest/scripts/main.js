const tileImages = {
  1: '/wyndOS/quest/tiles/1.png',
  2: '/wyndOS/quest/tiles/2.png',
  3: '/wyndOS/quest/tiles/3.png',
  4: '/wyndOS/quest/tiles/4.png'
};

let offsetX = 0, offsetY = 0;
const step = 20;

fetch('/wyndOS/quest/tilemaps/demo.tiles')
  .then(response => response.text())
  .then(text => {
      const tileData = text.trim().split('\n').map(line => line.split(' ').map(Number));
      const tilemap = document.getElementById("tilemap");
      tilemap.style.gridTemplateColumns = `repeat(${tileData[0].length}, 40px)`;
      
      tileData.forEach(row => {
          row.forEach(num => {
              const tile = document.createElement("div");
              tile.className = "tile";
              if (tileImages[num]) {
                  tile.style.backgroundImage = `url(${tileImages[num]})`;
              }
              tilemap.appendChild(tile);
          });
      });
  })
  .catch(error => console.error('Error loading tilemap:', error));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') offsetY -= step;
  if (event.key === 'ArrowDown') offsetY += step;
  if (event.key === 'ArrowLeft') offsetX -= step;
  if (event.key === 'ArrowRight') offsetX += step;
  document.getElementById("tilemap").style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});