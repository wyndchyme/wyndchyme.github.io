const scene = new THREE.Scene();

// Isometric Camera
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(-5 * aspect, 5 * aspect, 5, -5, 1, 100);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// Texture Loader with Pixelation
const textureLoader = new THREE.TextureLoader();

function loadPixelatedTexture(path) {
    const texture = textureLoader.load(path, (tex) => {
        tex.magFilter = THREE.NearestFilter; // Prevents smoothing when scaling up
        tex.minFilter = THREE.NearestFilter; // Prevents smoothing when scaling down
        tex.generateMipmaps = true; // Disables mipmaps for sharper pixels
    });
    return texture;
}

const playerTexture = loadPixelatedTexture('/icons/faviconalt.png');

const tileTexture = loadPixelatedTexture('/wyndOS/quest/textures/tiletest.png');

// Create a tiled ground (e.g., 10x10 grid)
const tileSize = 1;
const gridSize = 100;

for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
        const tileGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const tileMaterial = new THREE.MeshStandardMaterial({ map: tileTexture });
        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.rotation.x = -Math.PI / 2; // Align to the ground
        tile.position.set(x - gridSize / 2, 0, z - gridSize / 2);
        scene.add(tile);
    }
}

// Player Cube
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ map: playerTexture });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0.5, 0);
scene.add(player);

// Keyboard Input
document.addEventListener('keydown', (event) => {
    const step = 1;
    switch (event.key) {
        case 'ArrowUp': player.position.z -= step; break;
        case 'ArrowDown': player.position.z += step; break;
        case 'ArrowLeft': player.position.x -= step; break;
        case 'ArrowRight': player.position.x += step; break;
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
    const newAspect = window.innerWidth / window.innerHeight;
    camera.left = -5 * newAspect;
    camera.right = 5 * newAspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
