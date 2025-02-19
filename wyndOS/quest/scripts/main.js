const tileImages = {
  0: [
    '/wyndOS/quest/tiles/water/water.png',
    '/wyndOS/quest/tiles/water/water_2.png',
    '/wyndOS/quest/tiles/water/water_3.png',
    '/wyndOS/quest/tiles/water/water_4.png',
    '/wyndOS/quest/tiles/water/water_3.png',
    '/wyndOS/quest/tiles/water/water_2.png',
  ],
  1: '/wyndOS/quest/tiles/coast/coast.png',
};

const tileWidth = 32;
const tileHeight = 32;
let offsetX, offsetY;
const step = 20;
const extra = 5;

const canvas = document.getElementById("tilemap");
const ctx = canvas.getContext("2d");

let loadedTileData;
let loadedTileImages;
let totalRows, totalCols;
let animationState = {};

function centerWorld() {
  const minX = -(totalRows - 1) * (tileWidth / 2) - tileWidth / 2;

  const maxX = (totalCols - 1) * (tileWidth / 2) + tileWidth / 2;

  const minY = -tileHeight / 2;

  const maxY = ((totalRows - 1) + (totalCols - 1)) * (tileHeight / 4) + tileHeight / 2;

  const worldWidth = maxX - minX;
  const worldHeight = maxY - minY;

  offsetX = (canvas.width - worldWidth) / 2 - minX;
  offsetY = (canvas.height - worldHeight) / 2 - minY;
}

function loadTileImages(tileImages) {
  const promises = [];
  const loaded = {};
  for (const key in tileImages) {
    const value = tileImages[key];
    if (Array.isArray(value)) {
      loaded[key] = [];
      value.forEach(src => {
        const img = new Image();
        const promise = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
        img.src = src;
        loaded[key].push(img);
        promises.push(promise);
      });
    } else {
      const img = new Image();
      const promise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
      img.src = value;
      loaded[key] = [img];
      promises.push(promise);
    }
  }
  return Promise.all(promises).then(() => loaded);
}

function loadTileMap() {
  return fetch('/wyndOS/quest/tilemaps/demo.tiles')
    .then(response => response.text())
    .then(text => {
      return text.trim().split('\n').map(line => {
        return line.match(/\[.*?\]|\d+/g).map(cell => {
          if (cell.startsWith('[') && cell.endsWith(']')) {
            return cell.slice(1, -1).split(',').map(Number);
          } else {
            return [Number(cell)];
          }
        });
      });
    });
}

Promise.all([loadTileImages(tileImages), loadTileMap()])
  .then(([tileImgs, tileData]) => {
    loadedTileImages = tileImgs;
    loadedTileData = tileData;
    totalRows = tileData.length + extra * 2;
    totalCols = tileData[0].length + extra * 2;
    canvas.width = (totalCols * tileWidth) / 2 + (tileWidth / 2) * (totalRows - 1);
    canvas.height = (totalCols * tileHeight) / 2 + (tileHeight / 2) * (totalRows - 1);    
    centerWorld();
    requestAnimationFrame(render);
  })
  .catch(error => console.error('Error loading resources:', error));

function render(currentTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      let tileNums;
      if (r >= extra && r < extra + loadedTileData.length &&
          c >= extra && c < extra + loadedTileData[0].length) {
        tileNums = loadedTileData[r - extra][c - extra];
      } else {
        tileNums = [0];
      }
      const isoX = (c - r) * (tileWidth / 2);
      const isoY = (c + r) * (tileHeight / 4);
      tileNums.forEach(tileNum => {
        const imgs = loadedTileImages[tileNum];
        let imgToDraw;
        if (Array.isArray(imgs)) {
          const frameDuration = 350;
          if (!animationState[tileNum]) {
            animationState[tileNum] = { frameIndex: 0, lastFrameTime: currentTime };
          }
          const state = animationState[tileNum];
          if (currentTime - state.lastFrameTime > frameDuration) {
            state.frameIndex = (state.frameIndex + 1) % imgs.length;
            state.lastFrameTime = currentTime;
          }
          imgToDraw = imgs[state.frameIndex];
        } else {
          imgToDraw = imgs[0];
        }
        
        ctx.drawImage(imgToDraw, isoX - tileWidth / 2, isoY - tileHeight / 2, tileWidth, tileHeight);
      });
    }
  }
  ctx.restore();
  requestAnimationFrame(render);
  ctx.imageSmoothingEnabled = false;
}

const diagStep = step / Math.sqrt(2);
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      offsetX -= diagStep;
      offsetY += diagStep / 2;
      break;
    case 'ArrowDown':
      offsetX += diagStep;
      offsetY -= diagStep / 2;
      break;
    case 'ArrowLeft':
      offsetX += diagStep;
      offsetY += diagStep / 2;
      break;
    case 'ArrowRight':
      offsetX -= diagStep;
      offsetY -= diagStep / 2;
      break;
  }
});
