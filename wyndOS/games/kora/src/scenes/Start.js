export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.tilemapTiledJSON("map", "assets/tlmap/demo/demo.tmj");  
        this.load.image("tileset", "assets/tls/coast.png");
    }

    create() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("coast", "tileset");  

        const layer1 = map.createLayer("h0", tileset, map.widthInPixels / 2, 0);
        const layer2 = map.createLayer("h0-decor", tileset, map.widthInPixels / 2, 0);
        const layer3 = map.createLayer("h1", tileset, map.widthInPixels / 2, 0);
        const layer4 = map.createLayer("h1-decor", tileset, map.widthInPixels / 2, 0);
        const layer5 = map.createLayer("h2", tileset, map.widthInPixels / 2, 0);
        const layer6 = map.createLayer("h2-decor", tileset, map.widthInPixels / 2, 0);
        layer1.setDepth(1);
        layer2.setDepth(2);
        layer3.setDepth(3);
        layer4.setDepth(4);
        layer5.setDepth(5);
        layer6.setDepth(6);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.input.on('pointerdown', (pointer) => {
            if (pointer.rightButtonDown()) {
                this.input.mousePointer.isDragging = true;
                this.input.mousePointer.startX = pointer.x;
                this.input.mousePointer.startY = pointer.y;
                this.input.mousePointer.startCamX = this.cameras.main.scrollX;
                this.input.mousePointer.startCamY = this.cameras.main.scrollY;
            }
        });
        this.input.on('pointermove', (pointer) => {
            if (this.input.mousePointer.isDragging) {
                this.cameras.main.scrollX = this.input.mousePointer.startCamX + (this.input.mousePointer.startX - pointer.x);
                this.cameras.main.scrollY = this.input.mousePointer.startCamY + (this.input.mousePointer.startY - pointer.y);
            }
        });
        this.input.on('pointerup', () => {
            this.input.mousePointer.isDragging = false;
        });
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            const zoomFactor = 0.1;
            this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - deltaY * zoomFactor * 0.01, 0.5, 2);
        });

        const tileAnimations = {
            9:  [7, 8, 7, 9],
            27: [25, 26, 25, 27],
            55: [51, 52, 53, 54, 55, 54, 53, 52],
            65: [61, 62, 63, 64, 65, 64, 63, 62],
            75: [71, 72, 73, 74, 75, 74, 73, 72]
        };

        this.animatedTiles = [];

        const layers = [layer1, layer2, layer3, layer4, layer5, layer6];

        layers.forEach(layer => {
            layer.forEachTile(tile => {
                const baseId = tile.index - tileset.firstgid;
                if (tileAnimations.hasOwnProperty(baseId)) {
                    this.animatedTiles.push({
                        tile: tile,
                        animation: tileAnimations[baseId],
                        currentFrame: 0,
                        elapsed: 0,
                        frameDuration: 350
                    });
                }
            });
        });
    }

    update(time, delta) {
        const speed = 5;

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.cameras.main.scrollX -= speed;
        }
        if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.cameras.main.scrollX += speed;
        }
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.cameras.main.scrollY -= speed;
        }
        if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.cameras.main.scrollY += speed;
        }

        this.animatedTiles.forEach(animTile => {
            animTile.elapsed += delta;
            if (animTile.elapsed >= animTile.frameDuration) {
                animTile.elapsed -= animTile.frameDuration;
                animTile.currentFrame = (animTile.currentFrame + 1) % animTile.animation.length;
                animTile.tile.index = animTile.animation[animTile.currentFrame] + animTile.tile.tileset.firstgid;
            }
        });
    }
}
