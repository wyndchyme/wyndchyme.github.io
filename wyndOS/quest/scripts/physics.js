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

function parseTilemap(tilemapStr) {
  return tilemapStr.trim().split('\n').map(row => 
    row.split(' ').map(tile => {
      const match = tile.match(/\[([^\]]*)\]/);
      return match ? match[1].split(',').pop() : null;
    })
  );
}

function parseHeight(tileValue) {
  const match = tileValue.match(/h(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
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
      const heightValue = parseHeight(heightMap[row][col]);
      const geometry = new THREE.BoxGeometry(tileSize, tileSize / 2, tileSize);
      const material = new THREE.MeshBasicMaterial({ color: getColorForHeight(heightValue) });
      const tile = new THREE.Mesh(geometry, material);
      tile.position.set(
        col * tileSize - centerX,
        heightValue * (tileSize / 2),
        row * tileSize - centerZ
      );
      grid.add(tile);
    }
  }
  return grid;
}

function createPlayer(tileSize) {
  const geometry = new THREE.BoxGeometry(tileSize, tileSize, tileSize);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const player = new THREE.Mesh(geometry, material);
  player.position.set(0.5, 0, 1.5);
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
      const heightMap = parseTilemap(tilemapText);
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
        if (!renderEnabled) return
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

canvas.style.position = 'absolute';
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
