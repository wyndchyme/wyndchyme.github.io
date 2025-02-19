const tileImages = {
  0:
    '/wyndOS/quest/tiles/tile.png',
  1:
    '/wyndOS/quest/tiles/coast/coast.png',
  2: 
    '/wyndOS/quest/tiles/coast/coast_tl.png',
  3: 
    '/wyndOS/quest/tiles/coast/coast_bl.png',
  4: 
    '/wyndOS/quest/tiles/coast/coast_tr.png',
  5: 
    '/wyndOS/quest/tiles/coast/coast_br.png',
  6: 
    '/wyndOS/quest/tiles/puddle/puddle.png',
  7: 
    '/wyndOS/quest/tiles/shore/shore.png',
    /* RESERVED FOR SHORE_TL */
  9: 
    '/wyndOS/quest/tiles/shore/shore_bl.png',
    /* RESERVED FOR SHORE_TR */
  11: 
    '/wyndOS/quest/tiles/shore/shore_br.png',
  12: 
    '/wyndOS/quest/tiles/shore/shore_mod.png',
    /* RESERVED FOR SHORE_JOINER_TL */
  14: 
    '/wyndOS/quest/tiles/shore/shore_joiner_bl.png',
    /* RESERVED FOR SHORE_JOINER_TR */
  16: 
    '/wyndOS/quest/tiles/shore/shore_joiner_br.png',
  17: 
    '/wyndOS/quest/tiles/sand/sand.png',
  18: [
    '/wyndOS/quest/tiles/seafoam/seafoam.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_2.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_3.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_4.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_5.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_4.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_3.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_2.png',
  ],
  19: [
  '/wyndOS/quest/tiles/seafoam/seafoam_l.png',
  '/wyndOS/quest/tiles/seafoam/seafoam_l_2.png',
  '/wyndOS/quest/tiles/seafoam/seafoam_l_3.png',
  '/wyndOS/quest/tiles/seafoam/seafoam_l_4.png',
  '/wyndOS/quest/tiles/seafoam/seafoam_l_5.png',
  '/wyndOS/quest/tiles/seafoam/seafoam_l_4.png',
  '/wyndOS/quest/tiles/seafoam/seafoam_l_3.png',
  '/wyndOS/quest/tiles/seafoam/seafoam_l_2.png',
  ],
  20: [
    '/wyndOS/quest/tiles/seafoam/seafoam_r.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_r_2.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_r_3.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_r_4.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_r_5.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_r_4.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_r_3.png',
    '/wyndOS/quest/tiles/seafoam/seafoam_r_2.png',
    ],
  21: 
    '/wyndOS/quest/tiles/seaweed/seaweed.png',
  22: [
    '/wyndOS/quest/tiles/sprig/sprig.png',
    '/wyndOS/quest/tiles/sprig/sprig_2.png',
    '/wyndOS/quest/tiles/sprig/sprig.png',
    '/wyndOS/quest/tiles/sprig/sprig_3.png',
  ],
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
let waterAnimationState = {};
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

function loadTileMap() {
  return fetch('/wyndOS/quest/tilemaps/demo.tls')
    .then(response => response.text())
    .then(text => {
      return text.trim().split('\n').map(line => {
        return line.match(/\[.*?\]|\d+/g).map(cell => {
          if (cell.startsWith('[') && cell.endsWith(']')) {
            let parts = cell.slice(1, -1).split(',').map(x => isNaN(x) ? x.trim() : Number(x));
            let tiles = parts.filter(x => typeof x === 'number');
            let height = parts.find(x => typeof x === 'string') || 'h0'; // Default to h0
            return { tiles, height };
          } else {
            return { tiles: [Number(cell)], height: 'h0' };
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
    ctx.imageSmoothingEnabled = false; 
    ctx.save();
    ctx.translate(Math.floor(offsetX), Math.floor(offsetY)); 
  
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < totalCols; c++) {
        
        let tileData = (r >= extra && r < extra + loadedTileData.length && c >= extra && c < extra + loadedTileData[0].length)
          ? loadedTileData[r - extra][c - extra]
          : { tiles: [0], height: 'h0' };
  
        
        const heightValue = parseInt(tileData.height.replace('h', '')) || 0;
        const heightOffset = heightValue * -8;
  
       
        const isoX = Math.round((c - r) * (tileWidth / 2));
        const isoY = Math.round((c + r) * (tileHeight / 4) + heightOffset);
  
        
        tileData.tiles.forEach(tileNum => {
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
  
          
          ctx.drawImage(imgToDraw, isoX - tileWidth / 2, isoY - tileHeight / 2, tileWidth, tileHeight);
  
          
          if (tileNum === 0) {
            const tintKey = r + ',' + c;
            if (!waterTileTint[tintKey]) {
              const hue = 200 + Math.floor(Math.random() * 21) - 10;
              waterTileTint[tintKey] = "hsla(" + hue + ",60%,50%,0.1)";
            }
            ctx.save();
            ctx.fillStyle = waterTileTint[tintKey];
            ctx.fillRect(isoX - tileWidth / 2, isoY - tileHeight / 2, tileWidth, tileHeight);
            ctx.restore();
          }
        });
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
