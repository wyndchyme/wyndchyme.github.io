export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.tilemapTiledJSON("map", "assets/tlmap/demo/demo.tmj");  
        this.load.image("tileset", "assets/tls/coast.png");
        this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    }

    create() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("coast", "tileset");  

        const layers = [
    map.createLayer("h0", tileset, map.widthInPixels / 2, 0),
    map.createLayer("h0-decor", tileset, map.widthInPixels / 2, 0),
    map.createLayer("h0-foam", tileset, map.widthInPixels / 2, 0),
    map.createLayer("h1", tileset, map.widthInPixels / 2, 0),
    map.createLayer("h1-decor", tileset, map.widthInPixels / 2, 0),
    map.createLayer("h2", tileset, map.widthInPixels / 2, 0),
    map.createLayer("h2-decor", tileset, map.widthInPixels / 2, 0)
];

layers.forEach((layer, index) => {
    const layerData = map.getLayer(layer.layer.name); 
    const offsetY = layerData.y || 0;
    layer.setY(offsetY);
    layer.setDepth(index + 1);
});

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(2);
        this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        const tileAnimations = {
            9:  [7, 8, 7, 9],
            27: [25, 26, 25, 27],
            49: [45, 46, 48, 47, 49],
            55: [51, 52, 53, 54, 55, 54, 53, 52],
            65: [61, 62, 63, 64, 65, 64, 63, 62],
            75: [71, 72, 73, 74, 75, 74, 73, 72]
        };

        this.animatedTiles = [];

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

        // const player = this.physics.add.sprite(100, 450, 'dude');

        // player.setBounce(0.2);
        // player.setCollideWorldBounds(true);

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
