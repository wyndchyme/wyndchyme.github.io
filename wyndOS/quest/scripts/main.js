
        const scene = new THREE.Scene();

        
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new THREE.OrthographicCamera(-5 * aspect, 5 * aspect, 5, -5, 1, 100);
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);

        
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

        
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const player = new THREE.Mesh(geometry, material);
        player.position.set(0, 0.5, 0);
        scene.add(player);

        
        document.addEventListener('keydown', (event) => {
            const step = 1;
            switch (event.key) {
                case 'ArrowUp':    player.position.z -= step; break; // Move up
                case 'ArrowDown':  player.position.z += step; break; // Move down
                case 'ArrowLeft':  player.position.x -= step; break; // Move left
                case 'ArrowRight': player.position.x += step; break; // Move right
            }
        });

        
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        animate();

        
        window.addEventListener('resize', () => {
            const newAspect = window.innerWidth / window.innerHeight;
            camera.left = -5 * newAspect;
            camera.right = 5 * newAspect;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
