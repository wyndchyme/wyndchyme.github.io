import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let renderEnabled = true; 

const canvas = document.getElementById('render3d');

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const size = 5;

const camera = new THREE.OrthographicCamera(
  -size * aspect, 
  size * aspect,  
  size,           
  -size,         
  0.1,            
  1000          
);
camera.position.set(5, 4, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

function parseTileHeights(tileValue) {
  const rangeMatch = tileValue.match(/h(\d+)-(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    const heights = [];
    for (let h = min; h <= max; h++) {
      heights.push(h);
    }
    return heights;
  }
  const match = tileValue.match(/h(\d+)/);
  return match ? [parseInt(match[1], 10)] : [0];
}

function getColorForHeight(height) {
  return [0x0000ff, 0x00ff00, 0xff0000][height] || 0xffffff;
}

function createTileGrid(heightMap, tileSize) {
  const grid = new THREE.Group();
  const numRows = heightMap.length;
  const numCols = heightMap[0].length;
  const centerX = (numCols - 1) * tileSize / 2;
  const centerZ = (numRows - 1) * tileSize / 2;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const heights = parseTileHeights(heightMap[row][col]);
      heights.forEach(layer => {
        const geometry = new THREE.BoxGeometry(tileSize, tileSize / 2, tileSize);
        const material = new THREE.MeshBasicMaterial({ color: getColorForHeight(layer) });
        const tile = new THREE.Mesh(geometry, material);

        tile.position.set(
          col * tileSize - centerX,
          layer * (tileSize / 2),
          row * tileSize - centerZ
        );
        grid.add(tile);
      });
    }
  }
  return grid;
}

function createPlayer(tileSize) {
  const geometry = new THREE.BoxGeometry(tileSize, tileSize, tileSize);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const player = new THREE.Mesh(geometry, material);
  player.position.set(0.5, 0.75, 1.5);
  return player;
}

export let player;

export const playerReady = new Promise((resolve, reject) => {
  fetch('/wyndOS/quest/resources/tilemaps/demo_2.tls')
    .then(response => {
      if (!response.ok) {
        throw new Error('Tilemap file not found: ' + response.statusText);
      }
      return response.text();
    })
    .then(tilemapText => {
      const heightMap = tilemapText.trim().split('\n').map(row => 
        row.split(' ').map(tile => {
          const match = tile.match(/\[([^\]]*)\]/);

          return match ? match[1].split(',').pop() : null;
        })
      );
      const grid = createTileGrid(heightMap, 1);
      scene.add(grid);

      player = createPlayer(1);
      scene.add(player);

      document.dispatchEvent(new CustomEvent('playerReady', { detail: { player } }));
      resolve(player);

      document.addEventListener('keydown', (e) => {
        const moveDistance = 1;
        switch(e.code) {
          case 'ArrowUp':
            player.position.z -= moveDistance;
            break;
          case 'ArrowDown':
            player.position.z += moveDistance;
            break;
          case 'ArrowLeft':
            player.position.x -= moveDistance;
            break;
          case 'ArrowRight':
            player.position.x += moveDistance;
            break;
        }
      });

      function animate() {
        if (!renderEnabled) return;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
    })
    .catch(error => {
      console.error("Error loading tilemap:", error);
      reject(error);
    });
});

const smallWidth = 300;
const smallHeight = 200;

renderer.setSize(smallWidth, smallHeight);

const newAspect = smallWidth / smallHeight;
camera.left = -size * newAspect;
camera.right = size * newAspect;
camera.top = size;
camera.bottom = -size;
camera.updateProjectionMatrix();

canvas.style.position = 'fixed';
canvas.style.top = '20px';
canvas.style.right = '0';

window.addEventListener('resize', () => {
  renderer.setSize(smallWidth, smallHeight);
  camera.left = -size * newAspect;
  camera.right = size * newAspect;
  camera.top = size;
  camera.bottom = -size;
  camera.updateProjectionMatrix();
});

let playerVelocity = new THREE.Vector3(0, 0, 0);
let isOnGround = false;
const jumpSpeed = 0.075;
const gravity = -0.005;
const maxFallSpeed = -0.2;
let previousPosition = new THREE.Vector3();

let lastGroundHeight = 0;

const allowedStep = 0.55;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && isOnGround) {
    playerVelocity.y = jumpSpeed;
    isOnGround = false;
  }
});

function physicsUpdate() {
  if (!isOnGround) {
    playerVelocity.y += gravity;
    if (playerVelocity.y < maxFallSpeed) {
      playerVelocity.y = maxFallSpeed;
    }
  }

  previousPosition.copy(player.position);
  const newY = player.position.y + playerVelocity.y;

  const downRay = new THREE.Raycaster(
    player.position,
    new THREE.Vector3(0, -1, 0),
    0,
    2
  );
  const tileMeshes = [];
  scene.traverse((child) => {
    if (child.isMesh && child !== player && child.geometry.type === 'BoxGeometry') {
      tileMeshes.push(child);
    }
  });
  const intersects = downRay.intersectObjects(tileMeshes, true);

  let validLanding = null;
  for (let intersect of intersects) {
    const tile = intersect.object;
    const tileWorldPos = tile.getWorldPosition(new THREE.Vector3());
    const tileTop = tileWorldPos.y + 0.25;

    if (tileTop <= lastGroundHeight + allowedStep + 0.01) {
      validLanding = { tile, tileTop };
      break;
    }
  }

  if (validLanding && (newY - 0.5 <= validLanding.tileTop + 0.01)) {

    player.position.y = validLanding.tileTop + 0.5;
    playerVelocity.y = 0;
    isOnGround = true;

    lastGroundHeight = validLanding.tileTop;
  } else {
    player.position.y = newY;
    isOnGround = false;
  }

  checkHorizontalCollision();
}

function checkHorizontalCollision() {
  scene.traverse((child) => {
    if (child.isMesh && child !== player && child.geometry.type === 'BoxGeometry') {
      const tileWorldPos = child.getWorldPosition(new THREE.Vector3());
      const tileTop = tileWorldPos.y + 0.25;
      if (Math.abs(player.position.x - tileWorldPos.x) < 1 &&
          Math.abs(player.position.z - tileWorldPos.z) < 1) {

        if (tileTop - lastGroundHeight > allowedStep) {
          player.position.x = previousPosition.x;
          player.position.z = previousPosition.z;
        }
      }
    }
  });
}

function physicsLoop() {
  if (typeof player !== 'undefined') {
    physicsUpdate();
  }
  requestAnimationFrame(physicsLoop);
}

document.addEventListener('playerReady', () => {
  physicsLoop();
});

document.addEventListener('playerReady', () => {
  fetch('/wyndOS/quest/resources/tilemaps/demo_2.tls')
    .then(response => response.text())
    .then(tilemapText => {
      const tilemapArray = tilemapText.trim().split('\n').map(row =>
        row.split(' ').map(tile => {
          const match = tile.match(/\[([^\]]+)\]/);
          return match ? match[1].split(',').map(s => s.trim()) : [];
        })
      );

      const gridGroup = scene.children.find(child => child.type === 'Group');
      if (!gridGroup) {
        console.error("Grid group not found.");
        return;
      }

      const numRows = tilemapArray.length;
      const numCols = tilemapArray[0].length;
      const centerX = (numCols - 1) / 2;
      const centerZ = (numRows - 1) / 2;

      const cellMap = {};
      gridGroup.children.forEach(tile => {
        const col = Math.round(tile.position.x + centerX);
        const row = Math.round(tile.position.z + centerZ);
        const key = `${col},${row}`;
        if (!cellMap[key]) cellMap[key] = [];
        cellMap[key].push(tile);
      });

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const tileData = (tilemapArray[row] && tilemapArray[row][col]) || [];
          const tileNumbers = tileData.filter(part => !/^h\d+(?:-\d+)?$/i.test(part));
          const heightPart = tileData.find(part => /^h\d+(?:-\d+)?$/i.test(part));
          const heights = heightPart ? parseTileHeights(heightPart) : [0];

          const cellTop = Math.max(...heights);
          const key = `${col},${row}`;
          const cellTiles = cellMap[key] || [];
          cellTiles.forEach(tile => {
            tile.userData.tileNumbers = tileNumbers;
            tile.userData.tileHeight = cellTop;
            tile.userData.worldTileHeight = cellTop;
          });
        }
      }

      const getTileAt = (col, row) => {
        const tiles = gridGroup.children.filter(tile => {
          const tCol = Math.round(tile.position.x + centerX);
          const tRow = Math.round(tile.position.z + centerZ);
          return tCol === col && tRow === row;
        });
        if (tiles.length === 0) return null;
        return tiles.reduce((maxTile, tile) => {
          return (!maxTile || tile.userData.worldTileHeight > maxTile.userData.worldTileHeight) ? tile : maxTile;
        }, null);
      };

      document.addEventListener('keydown', (e) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code))
          return;
        if (!player || !isOnGround) return;

        const getGridCoords = (x, z) => ({
          col: Math.round(x + centerX),
          row: Math.round(z + centerZ)
        });

        const { col: currentCol, row: currentRow } = getGridCoords(player.position.x, player.position.z);
        const currentTile = getTileAt(currentCol, currentRow);
        if (!currentTile) return;
        const currentHeight = currentTile.userData.worldTileHeight;
        const currentNumbers = currentTile.userData.tileNumbers || [];

        let destCol = currentCol, destRow = currentRow;
        switch(e.code) {
          case 'ArrowUp':
            destRow = currentRow - 1;
            break;
          case 'ArrowDown':
            destRow = currentRow + 1;
            break;
          case 'ArrowLeft':
            destCol = currentCol - 1;
            break;
          case 'ArrowRight':
            destCol = currentCol + 1;
            break;
        }
        const destTile = getTileAt(destCol, destRow);
        if (!destTile) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        const destHeight = destTile.userData.worldTileHeight;

        if (destHeight > currentHeight && !currentNumbers.includes("23")) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);
    });
});