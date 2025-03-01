import { tileImages } from '/wyndOS/quest/scripts/dictionary.js';

let environmentConfig = {};

fetch('/wyndOS/quest/resources/tilemaps/environment_config.json')
  .then(response => response.json())
  .then(config => {
    environmentConfig = config;
    extra = environmentConfig.extra || 0;
    applyCanvasStyles(environmentConfig.canvasStyles);
    initializeTilemap();
  })
  .catch(error => console.error('Error loading environment config:', error));

const tileWidth = 32;
const tileHeight = 32;
let offsetX, offsetY;
const step = 20;
let extra = 0;
let zoom = 1;
const canvas = document.getElementById("tilemap");
const ctx = canvas.getContext("2d");

function applyCanvasStyles(styles) {
  if (!styles) return;
  Object.entries(styles).forEach(([key, value]) => {
    canvas.style[key] = value;
  });
}

let loadedTileImages;
let baseTileMap;
let overlayTileMap;
let totalRows, totalCols;
let animationState = {};
let waterTileTint = {};
const brightnessCache = {};

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
            let heightSpec = parts.find(x => typeof x === 'string') || 'h0';
            let heights = parseHeightRange(heightSpec);
            return { tiles, heights };
          } else {
            return { tiles: [Number(cell)], heights: [0] };
          }
        });
      });
    });
}

function parseHeightRange(heightSpec) {
  const match = heightSpec.match(/^h(\d+)(?:-(\d+))?$/);
  if (!match) return [0];
  const start = parseInt(match[1]);
  const end = match[2] ? parseInt(match[2]) : start;
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getBrightenedTile(img, brightnessFactor) {
  const cacheKey = img.src + '-' + brightnessFactor;
  if (brightnessCache[cacheKey]) {
    return brightnessCache[cacheKey];
  }
  const offCanvas = document.createElement('canvas');
  offCanvas.width = tileWidth;
  offCanvas.height = tileHeight;
  const offCtx = offCanvas.getContext('2d');
  offCtx.imageSmoothingEnabled = false;
  if ('filter' in offCtx) {
    offCtx.filter = `brightness(${brightnessFactor})`;
    offCtx.drawImage(img, 0, 0, tileWidth, tileHeight);
  } else {
    offCtx.drawImage(img, 0, 0, tileWidth, tileHeight);
    let imageData = offCtx.getImageData(0, 0, tileWidth, tileHeight);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(data[i] * brightnessFactor, 255);
      data[i + 1] = Math.min(data[i + 1] * brightnessFactor, 255);
      data[i + 2] = Math.min(data[i + 2] * brightnessFactor, 255);
    }
    offCtx.putImageData(imageData, 0, 0);
  }
  brightnessCache[cacheKey] = offCanvas;
  return offCanvas;
}

function drawTile(tileNum, isoX, isoY, brightnessFactor, currentTime) {
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
  const brightTile = getBrightenedTile(imgToDraw, brightnessFactor);
  ctx.drawImage(brightTile, isoX - tileWidth / 2, isoY - tileHeight / 2, tileWidth, tileHeight);
}

function render(currentTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.save();

  ctx.translate(Math.floor(offsetX), Math.floor(offsetY));
  ctx.scale(zoom, zoom);

  const A = tileWidth / 2;
  const B = tileHeight / 4;
  const playerSize = 20; 

  let playerCellRow = -1, playerCellCol = -1, playerIsoX = 0, playerIsoY = 0;
  if (globalPlayer && baseTileMap) {
    const baseCols = baseTileMap[0].length;
    const baseRows = baseTileMap.length;
    const centerX = baseCols / 2;
    const centerY = baseRows / 2;
    playerCellCol = Math.floor(globalPlayer.position.x + centerX + extra);
    playerCellRow = Math.floor(globalPlayer.position.z + centerY + extra);
    playerIsoX = (playerCellCol - playerCellRow) * A;
    playerIsoY = (playerCellCol + playerCellRow) * B - 16 * (globalPlayer.position.y - 0.75);
  }

  const playerDepth = playerCellRow + playerCellCol;
  const maxDiag = totalRows + totalCols - 2;

  function drawPlayer() {
    ctx.fillStyle = 'red';

    ctx.fillRect(playerIsoX - playerSize / 2, playerIsoY - playerSize, playerSize, playerSize);
  }

  function drawCell(r, c) {
    const isoX = (c - r) * A;
    const baseY = (c + r) * B;

    let tileData =
      (r >= extra && r < extra + baseTileMap.length &&
       c >= extra && c < extra + baseTileMap[0].length)
        ? baseTileMap[r - extra][c - extra]
        : { tiles: [0], heights: [0] };

    tileData.heights.forEach((heightValue) => {
      const tileY = baseY - 8 * heightValue;
      tileData.tiles.forEach(tileNum => {
        const brightnessFactor = 1 + (heightValue * 0.1);
        drawTile(tileNum, isoX, tileY, brightnessFactor, currentTime);

        if (tileNum === 0) {
          const tintKey = r + ',' + c;
          if (!waterTileTint[tintKey]) {
            const hueMin = environmentConfig.waterTints.hueRange[0];
            const hueMax = environmentConfig.waterTints.hueRange[1];
            const hue = Math.floor(Math.random() * (hueMax - hueMin + 1)) + hueMin;
            waterTileTint[tintKey] = `hsla(${hue},${environmentConfig.waterTints.saturation}%,${environmentConfig.waterTints.lightness}%,${environmentConfig.waterTints.alpha})`;
          }
          ctx.save();
          ctx.fillStyle = waterTileTint[tintKey];
          ctx.fillRect(
            isoX - tileWidth / environmentConfig.waterTints.xOffset,
            tileY - tileHeight / environmentConfig.waterTints.yOffset,
            tileWidth,
            tileHeight
          );
          ctx.restore();
        }
      });
    });

    overlayTileMap.forEach(overlayData => {
      if (r >= extra && r < extra + overlayData.length &&
          c >= extra && c < extra + overlayData[0].length) {
        const overlayTile = overlayData[r - extra][c - extra];
        if (overlayTile) {
          overlayTile.heights.forEach(heightValue => {
            const overlayY = baseY - 8 * heightValue;
            overlayTile.tiles.forEach(tileNum => {
              const brightnessFactor = 1 + (heightValue * 0.15);
              drawTile(tileNum, isoX, overlayY, brightnessFactor, currentTime);
            });
          });
        }
      }
    });
  }

  for (let diag = 0; diag < playerDepth; diag++) {
    for (let r = 0; r < totalRows; r++) {
      const c = diag - r;
      if (c < 0 || c >= totalCols) continue;
      drawCell(r, c);
    }
  }

  for (let r = 0; r < totalRows; r++) {
    const c = playerDepth - r;
    if (c < 0 || c >= totalCols) continue;
    drawCell(r, c);
  }

  drawPlayer();

  for (let diag = playerDepth + 1; diag <= maxDiag; diag++) {
    for (let r = 0; r < totalRows; r++) {
      const c = diag - r;
      if (c < 0 || c >= totalCols) continue;
      drawCell(r, c);
    }
  }

  ctx.restore();
  requestAnimationFrame(render);
}

function initializeTilemap() {
  extra = environmentConfig.extra || 0;
  Promise.all([
    loadTileImages(tileImages),
    loadTileMap('/wyndOS/quest/resources/tilemaps/demo.tls'),
    loadTileMap('/wyndOS/quest/resources/tilemaps/demo_2.tls')
  ])
    .then(([tileImgs, baseData, ...overlayData]) => {
      loadedTileImages = tileImgs;
      baseTileMap = baseData;
      overlayTileMap = overlayData;
      totalRows = baseTileMap.length + extra * 2;
      totalCols = baseTileMap[0].length + extra * 2;
      canvas.width = (totalCols * tileWidth) / 2 + (tileWidth / 2) * (totalRows - 1);
      canvas.height = (totalCols * tileHeight) / 2 + (tileHeight / 2) * (totalRows - 1);
      centerWorld();
      requestAnimationFrame(render);
    })
    .catch(error => console.error('Error loading resources:', error));
}

Promise.all([
  loadTileImages(tileImages),
  loadTileMap('/wyndOS/quest/resources/tilemaps/demo.tls'),
  loadTileMap('/wyndOS/quest/resources/tilemaps/demo_2.tls')
])
  .then(([tileImgs, baseData, ...overlayData]) => {
    loadedTileImages = tileImgs;
    baseTileMap = baseData;
    overlayTileMap = overlayData;
    totalRows = baseTileMap.length + extra * 2;
    totalCols = baseTileMap[0].length + extra * 2;
    canvas.width = (totalCols * tileWidth) / 2 + (tileWidth / 2) * (totalRows - 1);
    canvas.height = (totalCols * tileHeight) / 2 + (tileHeight / 2) * (totalRows - 1);
    centerWorld();
    requestAnimationFrame(render);
  })
  .catch(error => console.error('Error loading resources:', error));

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "+":
      case "=":
        zoom += 1;
        break;
      case "-":
        zoom -= 1;
        if (zoom < 1) zoom = 1;
        break;
      case "0":
        zoom = 1;
        break;
    }
  });

import { playerReady } from '/wyndOS/quest/scripts/physics.js';

let globalPlayer = null;
playerReady.then(p => {
  globalPlayer = p;
});