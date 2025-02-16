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

        // Texture Loader
        const textureLoader = new THREE.TextureLoader();
        const groundTexture = textureLoader.load('/images/questbanneralt.png');
        const playerTexture = textureLoader.load('/icons/faviconalt.png');

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

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