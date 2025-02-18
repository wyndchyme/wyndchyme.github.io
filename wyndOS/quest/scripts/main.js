const tileImages = {
  1: '/wyndOS/quest/tiles/1.png',
  2: '/wyndOS/quest/tiles/2.png',
  3: '/wyndOS/quest/tiles/3.png',
  4: '/wyndOS/quest/tiles/4.png'
};

let offsetX = 0, offsetY = 0;
const step = 20;
const extra = 20;

const tilemap = document.getElementById("tilemap");

fetch('/wyndOS/quest/tilemaps/demo.tiles')
  .then(response => response.text())
  .then(text => {
      const loadedData = text.trim().split('\n').map(line =>
          line.split(' ').map(Number)
      );
      
      const loadedRows = loadedData.length;
      const loadedCols = loadedData[0].length;
      
      const totalRows = loadedRows + extra * 2;
      const totalCols = loadedCols + extra * 2;
      
      tilemap.style.gridTemplateColumns = `repeat(${totalCols}, 32px)`;
      
      for (let r = 0; r < totalRows; r++) {
          for (let c = 0; c < totalCols; c++) {
              const tile = document.createElement("div");
              tile.className = "tile";
              
              let tileNum;
              if (
                r >= extra && r < extra + loadedRows &&
                c >= extra && c < extra + loadedCols
              ) {
                  tileNum = loadedData[r - extra][c - extra];
              } else {
                  tileNum = 1;
              }
              
              if (tileImages[tileNum]) {
                  tile.style.backgroundImage = `url(${tileImages[tileNum]})`;
                  tile.style.width = "32px";
                  tile.style.height = "32px";
              }
              
              tilemap.appendChild(tile);
          }
      }
  })
  .catch(error => console.error('Error loading tilemap:', error));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') offsetY += step;
  if (event.key === 'ArrowDown') offsetY -= step;
  if (event.key === 'ArrowLeft') offsetX += step;
  if (event.key === 'ArrowRight') offsetX -= step;
  
  tilemap.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});
