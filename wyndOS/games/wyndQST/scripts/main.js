const canvas = document.getElementById('window');
const ctx = canvas.getContext('2d');

function showTextA(content, styles = {}) {
    const textDiv = document.getElementById('textA');
    textDiv.innerHTML = content;
    textDiv.style.display = 'block';
    Object.assign(textDiv.style, styles);
}


const scenes = {
  initial: {
        bgCloudsOffset: 0,
        bg: null,
        bgOffset: 0,
        rainOffsetX: 0,
        rainOffsetY: 15,
        rainSpeedX: -0.3,
        rainSpeedY: 10,
        lightningAlpha: 0,
        lightningDecay: 0.92,

        triggerLightning() {
            this.lightningAlpha = 0.1;
        },



        init() {
            this.bg = new Image();
            this.bg.src = '/wyndOS/games/wyndQST/assets/scene/initial/bg.png';
            this.bgLights = new Image();
            this.bgLights.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgLights.png'
            this.bgClouds = new Image();
            this.bgClouds.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgClouds.png'
            this.bgSparkles = new Image();
            this.bgSparkles.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgSparkles.png'
            this.bgSparkles2 = new Image();
            this.bgSparkles2.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgSparkles2.png'
            this.bgFoam = new Image();
            this.bgFoam.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFoam.png'
            this.bgFoam2 = new Image();
            this.bgFoam2.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFoam2.png'
            this.bgStars = new Image();
            this.bgStars.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgStars.png'
            this.bgStars2 = new Image();
            this.bgStars2.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgStars2.png'
            this.bgFlag = new Image();
            this.frameImages = [
                new Image(),
                new Image()
            ];
            this.frameImages[0].src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFlag.png';
            this.frameImages[1].src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFlag2.png';

            this.frameIndex = 0;
            this.lastFrameTime = 0;
            this.frameInterval = 400;

            this.someAnim = [
                new Image(),
                new Image()
            ];
            this.someAnim[0].src = '/wyndOS/games/wyndQST/assets/scene/initial/bgTree.png';
            this.someAnim[1].src = '/wyndOS/games/wyndQST/assets/scene/initial/bgTree2.png';

            this.someAnimIndex = 0;
            this.someAnimLastTime = 0;
            this.someAnimInterval = 600; 

            this.bgFog = new Image();
            this.bgFog.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFog.png'
            this.bgHighlights = new Image();
            this.bgHighlights.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgHighlights.png'
            this.bgRain = new Image();
            this.bgRain.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgRain.png'


        },

        update() {
            const tileSize = this.bg?.width || 1;
            if (this.bgOffset > tileSize) this.bgOffset = 0;

            // ABOVE IS UNUSED

            this.bgCloudsOffset -= 0.5; 
                if (this.bgCloudsOffset <= -canvas.width) {
                    this.bgCloudsOffset = 0;
                }

            const now = Date.now();
                if (now - this.lastFrameTime > this.frameInterval) {
                    this.frameIndex = (this.frameIndex + 1) % 2;
                    this.lastFrameTime = now;
                }

            if (now - this.someAnimLastTime > this.someAnimInterval) {
                this.someAnimIndex = (this.someAnimIndex + 1) % 2;
                this.someAnimLastTime = now;
            }

            this.rainOffsetX = (this.rainOffsetX + this.rainSpeedX) % (this.bgRain?.width || 1);
            this.rainOffsetY = (this.rainOffsetY + this.rainSpeedY) % (this.bgRain?.height || 1);

            if (this.lightningAlpha > 0.01) {
                this.lightningAlpha *= this.lightningDecay;
            } else {
                this.lightningAlpha = 0;
            }

            if (Math.random() < 0.005) { // 0.5% chance per frame (~every few seconds)
                this.triggerLightning();
            }



        },

        render() {
            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (this.bg?.complete) {
                ctx.drawImage(this.bg, 0, 0, canvas.width, canvas.height);
            }

            if (this.bgClouds?.complete) {
                ctx.save();
                ctx.globalAlpha = 0.5; 
                ctx.drawImage(this.bgClouds, this.bgCloudsOffset, 0, canvas.width, canvas.height);
                ctx.drawImage(this.bgClouds, this.bgCloudsOffset + canvas.width, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgLights?.complete) {
                const time = Date.now() * 0.002; 
                const alpha = 0.8 + 0.2 * Math.sin(time); 

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.bgLights, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgSparkles?.complete) {
                const time = Date.now() * 0.0068; 
                const alpha = 0.7 + 0.3 * Math.sin(time); 

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.bgSparkles, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgSparkles2?.complete) {
                const time = Date.now() * 0.005; 
                const alpha = 0.5 + 0.5 * Math.sin(time); 

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.bgSparkles2, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgFoam?.complete) {
                const time = Date.now() * 0.00089; 
                const alpha = 0.5 + 0.5 * Math.sin(time); 

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.bgFoam, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgFoam2?.complete) {
                const time = Date.now() * 0.001; 
                const alpha = 0.5 + 0.5 * Math.sin(time); 

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.bgFoam2, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgStars?.complete) {
                const time = Date.now() * 0.002; 
                const alpha = 0.5 + 0.5 * Math.sin(time); 

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.bgStars, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgStars2?.complete) {
                const time = Date.now() * 0.0013; 
                const alpha = 0.5 + 0.5 * Math.sin(time); 

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.bgStars2, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgHighlights?.complete) {
                const time = Date.now() * 0.0015; 
                const alpha = 0.025 + 0.025 * Math.sin(time);

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.bgHighlights, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            const img = this.frameImages[this.frameIndex];
                if (img.complete) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }

                const animImg = this.someAnim[this.someAnimIndex];
            if (animImg.complete) {
                ctx.drawImage(animImg, 0, 0, canvas.width, canvas.height); 
            }

            if (this.bgFog?.complete) {
                ctx.save();
                ctx.globalAlpha = 0.5; 
                ctx.drawImage(this.bgFog, this.bgCloudsOffset, 0, canvas.width, canvas.height);
                ctx.drawImage(this.bgFog, this.bgCloudsOffset + canvas.width, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            if (this.bgRain?.complete) {
                const iw = this.bgRain.width;
                const ih = this.bgRain.height;

                for (let x = -iw; x < canvas.width; x += iw) {
                    for (let y = -ih; y < canvas.height; y += ih) {
                        ctx.drawImage(
                            this.bgRain,
                            x + this.rainOffsetX,
                            y + this.rainOffsetY,
                            canvas.width,
                            canvas.height
                        );
                    }
                }
            }

            if (this.lightningAlpha > 0) {
                ctx.save();
                ctx.globalAlpha = this.lightningAlpha;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }



            showTextA(`
                <div data-base-font="55" style="position: relative; top: 3.5em; left: 0.7em; line-height: 1">
                <span style="text-decoration: underline">wyndQuest</span><br>
                <span data-base-font="30" style="text-decoration: none">Game of the Year Edition</span>
                </div>

                <div data-base-font="20" style="position: absolute; bottom: 0.5em; right: 1em; text-align: right; font-family: 'Jersey 10'">
                WYNDMARK INTERACTIVE STUDIOS<br>
                ©2002–2003 Wyndmark. All rights reserved.
                </div>
                `, {
            });
        }

    }
};

let currentScene = scenes.initial;
currentScene.init();

function gameLoop() {
    currentScene.update();
    currentScene.render();
    requestAnimationFrame(gameLoop);
}

gameLoop();