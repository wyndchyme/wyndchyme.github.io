console.log('LOADED MAIN.JS')

const canvas = document.getElementById('window');
const ctx = canvas.getContext('2d');
const lastTextContent = {
  textA: '',
  textB: '',
  textC: ''
};

let lastTime = performance.now();
let dt = 0;

let currentScene = null;
let languageStrings = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadLanguageJSON('/wyndOS/games/wyndQST/lang/en.json');
  switchToScene('disc');
  requestAnimationFrame(gameLoop);
});

// ESSENTIAL FUNCTIONS

function gameLoop(now) {
    dt = now - lastTime;
    lastTime = now;

    if (currentScene) {
        currentScene.update();
        currentScene.render();
    }

    requestAnimationFrame(gameLoop);
}

function switchToScene(sceneName) {
    currentScene = scenes[sceneName];
    currentScene.init();
}

async function loadLanguageJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to load language file');
  languageStrings = await response.json();
}

function getStringFromCode(code) {
  if (!languageStrings) return code;
  
  const match = code.match(/^\[string:([^\]]+)\]$/);
  if (!match) return code;

  const path = match[1].split(':');
  let str = languageStrings;
  for (const key of path) {
    if (str[key] === undefined) return code;
    str = str[key];
  }
  return str;
}

function showText(id, content, styles = {}) {
  const textDiv = document.getElementById(id);
  if (!textDiv) return;
  const translatedContent = getStringFromCode(content.trim());

  // Only update if content or style has changed
  if (lastTextContent[id] !== translatedContent) {
    textDiv.innerHTML = translatedContent;
    lastTextContent[id] = translatedContent;
  }
  textDiv.style.display = 'block';

  if (styles.opacity === undefined) {
    textDiv.style.opacity = '1';
  }
  Object.assign(textDiv.style, styles);
}

function setInteractiveTextDiv(id) {
  ['textA', 'textB', 'textC'].forEach(divId => {
    const div = document.getElementById(divId);
    if (!div) return;
    if (divId === id) {
      div.style.pointerEvents = 'auto';
      div.style.zIndex = 20; // Top
    } else {
      div.style.pointerEvents = 'none';
      div.style.zIndex = 10; // Lower
    }
  });
}

function enableQuitToDesktop() {
    const quitBtn = document.getElementById("quitToDesktop");
    if (quitBtn && !quitBtn._listenerSet) {
        quitBtn.addEventListener("click", function() {
            window.location.href = "/index.html";
        });
        quitBtn._listenerSet = true;
    }
}

const frameDuration = 75;

// SCENES
const scenes = {
    disc: {
    init() {
    console.log('INIT scene:disc')
      this.timer = 0;
      this.fadeAlpha = 0;
      this.fadeInTime = 0;
      this.visibleTime = 2000;
      this.fadeOutTime = 0;

      this.frameTimer = 0;
      this.frame = 0;

      this.frameImages = [new Image(), new Image()];
      this.frameImages[0].src = '/wyndOS/games/wyndQST/assets/scene/disc/disc1.png';
      this.frameImages[1].src = '/wyndOS/games/wyndQST/assets/scene/disc/disc2.png';
    },

    update() {
      this.timer += dt;
      this.frameTimer += dt;

      if (this.frameTimer > frameDuration) {
        this.frame = 1 - this.frame;
        this.frameTimer = 0;
      }

      if (this.timer < this.fadeInTime) {
        this.fadeAlpha = this.timer / this.fadeInTime;
      } else if (this.timer < this.fadeInTime + this.visibleTime) {
        this.fadeAlpha = 1;
      } else if (this.timer < this.fadeInTime + this.visibleTime + this.fadeOutTime) {
        const t = this.timer - this.fadeInTime - this.visibleTime;
        this.fadeAlpha = 1 - (t / this.fadeOutTime);
      } else {
        this.fadeAlpha = 0;
        setTimeout(() => {
          switchToScene('copyright');
        }, 100);
      }
    },

    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;

        const img = this.frameImages[this.frame];
        if (!img.complete) return;

        const alpha = Math.max(0, Math.min(1, this.fadeAlpha));
        ctx.save();
        ctx.globalAlpha = alpha;

        const scale = 2;
        const x = (ctx.canvas.width - img.width * scale) / 2;
        const y = (ctx.canvas.height - img.height * scale) / 2;

        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.transform(1, 0, 0.2, 1, 0, 0);
        ctx.drawImage(img, 0, 0);

        ctx.restore();
        }
  },

    copyright: {
        timer: 0,
        fadeAlpha: 0,
        fadeInTime: 1000,
        visibleTime: 3000,
        fadeOutTime: 1000,

        init() {
            console.log('INIT scene:copyright')
            this.timer = 0;
            this.fadeAlpha = 0;
            // showText is called here just to ensure the text starts at opacity 0.
            showText('textA', '[string:scene:copyright:copyright]', { opacity: 0 });
        },

        update() {
            this.timer += dt;

            if (this.timer < this.fadeInTime) {
                this.fadeAlpha = this.timer / this.fadeInTime;
            } else if (this.timer < this.fadeInTime + this.visibleTime) {
                this.fadeAlpha = 1;
            } else if (this.timer < this.fadeInTime + this.visibleTime + this.fadeOutTime) {
                const t = this.timer - this.fadeInTime - this.visibleTime;
                this.fadeAlpha = 1 - (t / this.fadeOutTime);
            } else {
                this.fadeAlpha = 0;
                setTimeout(() => {
                    switchToScene('initial');
                }, 2000);
            }
        },

        render() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            showText(
                'textA',
                `[string:scene:copyright:copyright]`,
                {
                    opacity: this.fadeAlpha,
                    transition: 'opacity 100ms linear'
                }
            );
        }
    },
    
    initial: {
        bgCloudsOffset: 0,
        bg: null,
        bgOffset: 0,
        rainOffsetX: 0,
        rainOffsetY: 15,
        rainSpeedX: -5,
        rainSpeedY: 20,
        lightningAlpha: 0,
        lightningDecay: 0.92,
        fadeOverlayAlpha: 1,

        triggerLightning() {
            this.lightningAlpha = 0.1;
        },

        init() {
            console.log('INIT scene:initial')
            this.bg = new Image();
            this.bg.src = '/wyndOS/games/wyndQST/assets/scene/initial/bg.png';
            this.bgLights = new Image();
            this.bgLights.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgLights.png';
            this.bgClouds = new Image();
            this.bgClouds.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgClouds.png';
            this.bgSparkles = new Image();
            this.bgSparkles.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgSparkles.png';
            this.bgSparkles2 = new Image();
            this.bgSparkles2.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgSparkles2.png';
            this.bgFoam = new Image();
            this.bgFoam.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFoam.png';
            this.bgFoam2 = new Image();
            this.bgFoam2.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFoam2.png';
            this.bgStars = new Image();
            this.bgStars.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgStars.png';
            this.bgStars2 = new Image();
            this.bgStars2.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgStars2.png';
            this.bgFlag = new Image();
            this.frameImages = [new Image(), new Image()];
            this.frameImages[0].src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFlag.png';
            this.frameImages[1].src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFlag2.png';

            this.frameIndex = 0;
            this.lastFrameTime = 0;
            this.frameInterval = 400;

            this.someAnim = [new Image(), new Image()];
            this.someAnim[0].src = '/wyndOS/games/wyndQST/assets/scene/initial/bgTree.png';
            this.someAnim[1].src = '/wyndOS/games/wyndQST/assets/scene/initial/bgTree2.png';

            this.someAnimIndex = 0;
            this.someAnimLastTime = 0;
            this.someAnimInterval = 600;

            this.bgFog = new Image();
            this.bgFog.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgFog.png';
            this.bgHighlights = new Image();
            this.bgHighlights.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgHighlights.png';
            this.bgRain = new Image();
            this.bgRain.src = '/wyndOS/games/wyndQST/assets/scene/initial/bgRain.png';
        },

        update() {
            this.bgCloudsOffset -= 1;
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

            if (Math.random() < 0.005) {
                this.triggerLightning();
            }

            if (this.fadeOverlayAlpha > 0) {
                this.fadeOverlayAlpha -= 0.01;
                if (this.fadeOverlayAlpha < 0) this.fadeOverlayAlpha = 0;
            }
        },

        render() {
            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const drawImg = (img, alpha = 1) => {
                if (img?.complete) {
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.drawImage(img, 400, 0, canvas.width, canvas.height); 
                    ctx.restore();
                }
            };

            drawImg(this.bg);
            drawImg(this.bgClouds, 0.5);

            if (this.bgClouds?.complete) {
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.drawImage(this.bgClouds, this.bgCloudsOffset + 30, 0, canvas.width, canvas.height); 
                ctx.drawImage(this.bgClouds, this.bgCloudsOffset + canvas.width + 30, 0, canvas.width, canvas.height); 
                ctx.restore();
            }

            drawImg(this.bgLights, 0.65 + 0.35 * Math.sin(Date.now() * 0.002));
            drawImg(this.bgSparkles, 0.7 + 0.3 * Math.sin(Date.now() * 0.0068));
            drawImg(this.bgSparkles2, 0.5 + 0.5 * Math.sin(Date.now() * 0.005));
            drawImg(this.bgFoam, 0.5 + 0.5 * Math.sin(Date.now() * 0.00089));
            drawImg(this.bgFoam2, 0.5 + 0.5 * Math.sin(Date.now() * 0.001));
            drawImg(this.bgStars, 0.5 + 0.5 * Math.sin(Date.now() * 0.002));
            drawImg(this.bgStars2, 0.5 + 0.5 * Math.sin(Date.now() * 0.0013));
            drawImg(this.bgHighlights, 0.025 + 0.025 * Math.sin(Date.now() * 0.0015));

            const flagImg = this.frameImages[this.frameIndex];
            if (flagImg.complete) ctx.drawImage(flagImg, 30, -120, canvas.width, canvas.height); 

            const treeImg = this.someAnim[this.someAnimIndex];
            if (treeImg.complete) ctx.drawImage(treeImg, 60, 30, canvas.width, canvas.height); 

            if (this.bgFog?.complete) {
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.drawImage(this.bgFog, this.bgCloudsOffset + 30, 0, canvas.width, canvas.height); 
                ctx.drawImage(this.bgFog, this.bgCloudsOffset + canvas.width + 30, 0, canvas.width, canvas.height); 
                ctx.restore();
            }

            if (this.bgRain?.complete) {
                const iw = this.bgRain.width;
                const ih = this.bgRain.height;
                for (let x = -iw; x < canvas.width; x += iw) {
                    for (let y = -ih; y < canvas.height; y += ih) {
                        ctx.drawImage(
                            this.bgRain,
                            x + this.rainOffsetX + 90,
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

            showText('textA', `[string:scene:initial:title]`);
            showText('textB', `[string:scene:initial:menu]`);
            showText('textC', `[string:scene:initial:version]`)
            enableQuitToDesktop();
            setInteractiveTextDiv('textB'); 

            if (this.fadeOverlayAlpha > 0) {
                ctx.save();
                ctx.globalAlpha = this.fadeOverlayAlpha;
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
        }
    }
};
