import { tileImages } from '/wyndOS/quest/scripts/dictionary.js'; 

const tileWidth = 32;
const tileHeight = 32;
let offsetX, offsetY;
const step = 20;
const extra = 5;
const canvas = document.getElementById("tilemap");
const ctx = canvas.getContext("2d");

let loadedTileImages;
let baseTileMap;    
let overlayTileMap; 
let totalRows, totalCols;
let animationState = {};
let waterTileTint = {};

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

function loadTileMap(url) {
  return fetch(url)
    .then(response => response.text())
    .then(text => {
      return text.trim().split('\n').map(line => {
        return line.match(/\[.*?\]|\d+/g).map(cell => {
          if (cell.startsWith('[') && cell.endsWith(']')) {
            let parts = cell.slice(1, -1).split(',').map(x => isNaN(x) ? x.trim() : Number(x));
            let tiles = parts.filter(x => typeof x === 'number');
            let height = parts.find(x => typeof x === 'string') || 'h0';
            return { tiles, height };
          } else {
            return { tiles: [Number(cell)], height: 'h0' };
          }
        });
      });
    });
}


Promise.all([
  loadTileImages(tileImages),
  loadTileMap('/wyndOS/quest/tilemaps/demo.tls'),
  loadTileMap('/wyndOS/quest/tilemaps/demo_2.tls')
])
  .then(([tileImgs, baseData, overlayData]) => {
    loadedTileImages = tileImgs;
    baseTileMap = baseData;
    overlayTileMap = overlayData;
    // For simplicity, assume both tilemaps have the same dimensions
    totalRows = baseTileMap.length + extra * 2;
    totalCols = baseTileMap[0].length + extra * 2;
    canvas.width = (totalCols * tileWidth) / 2 + (tileWidth / 2) * (totalRows - 1);
    canvas.height = (totalCols * tileHeight) / 2 + (tileHeight / 2) * (totalRows - 1);
    centerWorld();
    requestAnimationFrame(render);
  })
  .catch(error => console.error('Error loading resources:', error));

function render(currentTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false; 
  ctx.save();
  ctx.translate(Math.floor(offsetX), Math.floor(offsetY)); 

  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      let baseTile = (r >= extra && r < extra + baseTileMap.length &&
                      c >= extra && c < extra + baseTileMap[0].length)
          ? baseTileMap[r - extra][c - extra]
          : { tiles: [0], height: 'h0' };

      let overlayTile = (r >= extra && r < extra + overlayTileMap.length &&
                         c >= extra && c < extra + overlayTileMap[0].length)
          ? overlayTileMap[r - extra][c - extra]
          : null;

      const isoX = Math.round((c - r) * (tileWidth / 2));
      const baseHeightValue = parseInt(baseTile.height.replace('h', '')) || 0;
      const baseHeightOffset = baseHeightValue * -8;
      const baseIsoY = Math.round((c + r) * (tileHeight / 4) + baseHeightOffset);

      baseTile.tiles.forEach(tileNum => {
        const imgs = loadedTileImages[tileNum];
        let imgToDraw;
        const frameDuration = 350;

        if (Array.isArray(imgs)) {
          if (tileNum === 0) {
            imgToDraw = imgs[0];
          } else {
            if (!animationState[tileNum]) {
              animationState[tileNum] = { frameIndex: 0, lastFrameTime: currentTime };
            }
            const state = animationState[tileNum];
            if (currentTime - state.lastFrameTime > frameDuration) {
              state.frameIndex = (state.frameIndex + 1) % imgs.length;
              state.lastFrameTime = currentTime;
            }
            imgToDraw = imgs[state.frameIndex];
          }
        } else {
          imgToDraw = imgs[0];
        }

        ctx.drawImage(imgToDraw, isoX - tileWidth / 2, baseIsoY - tileHeight / 2, tileWidth, tileHeight);
        
        if (tileNum === 0) {
          const tintKey = r + ',' + c;
          if (!waterTileTint[tintKey]) {
            const hue = 200 + Math.floor(Math.random() * 21) - 10;
            waterTileTint[tintKey] = `hsla(${hue},60%,50%,0.1)`;
          }
          ctx.save();
          ctx.fillStyle = waterTileTint[tintKey];
          ctx.fillRect(isoX - tileWidth / 2, baseIsoY - tileHeight / 2, tileWidth, tileHeight);
          ctx.restore();
        }
      });

      if (overlayTile) {
        const overlayHeightValue = parseInt(overlayTile.height.replace('h', '')) || 0;
        const overlayHeightOffset = overlayHeightValue * -8;
        const overlayIsoY = Math.round((c + r) * (tileHeight / 4) + overlayHeightOffset);

        overlayTile.tiles.forEach(tileNum => {
          const imgs = loadedTileImages[tileNum];
          let imgToDraw;
          const frameDuration = 350;

          if (Array.isArray(imgs)) {
            if (tileNum === 0) {
              imgToDraw = imgs[0];
            } else {
              if (!animationState[tileNum]) {
                animationState[tileNum] = { frameIndex: 0, lastFrameTime: currentTime };
              }
              const state = animationState[tileNum];
              if (currentTime - state.lastFrameTime > frameDuration) {
                state.frameIndex = (state.frameIndex + 1) % imgs.length;
                state.lastFrameTime = currentTime;
              }
              imgToDraw = imgs[state.frameIndex];
            }
          } else {
            imgToDraw = imgs[0];
          }

          ctx.drawImage(imgToDraw, isoX - tileWidth / 2, overlayIsoY - tileHeight / 2, tileWidth, tileHeight);
        });
      }
    }
  }
  
  ctx.restore();
  requestAnimationFrame(render);
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
