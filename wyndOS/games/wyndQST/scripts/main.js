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
let currentInteractiveTextDiv = 'textB';

document.addEventListener('DOMContentLoaded', async () => {
  await loadLanguageJSON('/wyndOS/games/wyndQST/lang/en.json');
  applyInitialGammaBrightness();
  applyInitialFullscreen();
  applyInitialCRT();
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

function centerWindowContainerMobile() {
    const container = document.querySelector('.windowContainer');
    if (!container) return;
    if (window.innerWidth <= 800) {
        setTimeout(() => {
            const height = container.offsetHeight;
            const top = Math.max(0, (window.innerHeight - height) / 2);
            container.style.top = `${top}px`;
        }, 0);
    } else {
        container.style.top = 'calc(50vh - 300px)';
    }
}

window.addEventListener('resize', centerWindowContainerMobile);
window.addEventListener('DOMContentLoaded', centerWindowContainerMobile);


function adjustTextSize() {
            const container = document.querySelector('.windowContainer');
            const width = Math.min(container.clientWidth, 800);
            const baseWidth = 800;
            ['textA', 'textB', 'textC'].forEach(id => {
                const textDiv = document.getElementById(id);
                if (!textDiv) return;
                textDiv
                    .querySelectorAll('[data-base-font]')
                    .forEach(el => {
                        const baseFont = parseFloat(el.dataset.baseFont);
                        el.style.fontSize = (width / baseWidth * baseFont) + 'px';
                    });
            });
        }

        window.addEventListener('resize', adjustTextSize);

        ['textA', 'textB', 'textC'].forEach(id => {
            const textDiv = document.getElementById(id);
            if (!textDiv) return;
            const observer = new MutationObserver(muts => {
                for (let m of muts) {
                    if (m.type === 'childList' && m.addedNodes.length) {
                        adjustTextSize();
                        break;
                    }
                }
            });
            observer.observe(textDiv, { childList: true });
        });

        window.addEventListener('DOMContentLoaded', adjustTextSize);

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

function fitFilterDivToViewport() {
    const filterDiv = document.getElementById('filterDiv');
    if (!filterDiv) return;

    const baseWidth = 800;
    const baseHeight = 600;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const scale = Math.min(vw / baseWidth, vh / baseHeight);

    filterDiv.style.width = baseWidth + 'px';
    filterDiv.style.height = baseHeight + 'px';
    filterDiv.style.position = 'absolute';
    filterDiv.style.left = '0';
    filterDiv.style.top = '0';
    filterDiv.style.transform = `scale(${scale})`;
    filterDiv.style.transformOrigin = 'center center';

    setTimeout(() => {
        const rect = filterDiv.getBoundingClientRect();
        const filterDivCenterX = rect.left + rect.width / 2;
        const filterDivCenterY = rect.top + rect.height / 2;
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        const offsetX = viewportCenterX - filterDivCenterX;
        const offsetY = viewportCenterY - filterDivCenterY;

        const windowContainer = document.querySelector('.windowContainer');
        if (windowContainer) {
            windowContainer.style.position = 'fixed';
            windowContainer.style.left = '0';
            windowContainer.style.top = '0';
            windowContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            windowContainer.style.width = `${baseWidth * scale}px`;
            windowContainer.style.height = `${baseHeight * scale}px`;
            windowContainer.style.zIndex = '10';
        }

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        window.scrollTo(0, 0);
    }, 50);
}

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
            currentInteractiveTextDiv = 'textB';
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
              if (!this._sceneSwitched) {
                  this._sceneSwitched = true;
                  setTimeout(() => {
                      switchToScene('initial');
                  }, 2000);
              }
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

        _crtHandlerSet: false,
        _crtEnabled: false, 
        _fullscreenHandlerSet: false,
        _fullscreenEnabled: false,
        _fitFilterDivHandlerSet: false,

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

            currentInteractiveTextDiv = 'textB';
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
            if (treeImg.complete) ctx.drawImage(treeImg, 60, 28, canvas.width, canvas.height); 

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
            enableQuitToDesktop();
            
            setInteractiveTextDiv(currentInteractiveTextDiv);

            const settingsBtn = document.getElementById('settingsButton');
              if (settingsBtn && !settingsBtn._listenerSet) {
                  settingsBtn.addEventListener('click', () => {
                      showText('textC', '[string:scene:initial:settings]');
                      currentInteractiveTextDiv = 'textC';
                      setInteractiveTextDiv(currentInteractiveTextDiv);
                  });
                  settingsBtn._listenerSet = true;
              }

            const settingsCloseBtn = document.getElementById('settingsCloseButton');
              if (settingsCloseBtn && !settingsCloseBtn._listenerSet) {
                  settingsCloseBtn.addEventListener('click', () => {
                      const textC = document.getElementById('textC')
                      if (textC) textC.style.display = 'none';

                      currentInteractiveTextDiv = 'textB';
                      setInteractiveTextDiv(currentInteractiveTextDiv);
                  });
                  settingsBtn._listenerSet = true;
              }

            // CRT TOGGLE HANDLER
            if (!this._crtHandlerSet) {
                this._crtHandlerSet = true;
                const observer = new MutationObserver(() => {
                    const crtCheckbox = document.getElementById('crtCheckbox');
                    const crtUncheck = document.getElementById('crtUncheck');
                    const crtCheck = document.getElementById('crtCheck');
                    const windowDiv = document.getElementById('filterDiv');
                    if (crtCheckbox && crtUncheck && crtCheck && windowDiv) {
                        // Sync checkbox state with localStorage
                        let crtEnabled = localStorage.getItem('crtEnabled') === 'true';
                        this._crtEnabled = crtEnabled;
                        crtCheck.style.display = crtEnabled ? '' : 'none';
                        crtUncheck.style.display = crtEnabled ? 'none' : '';
                        if (crtEnabled) {
                            windowDiv.classList.add('crt');
                        } else {
                            windowDiv.classList.remove('crt');
                        }
                        crtCheckbox.addEventListener('click', () => {
                            this._crtEnabled = !this._crtEnabled;
                            crtCheck.style.display = this._crtEnabled ? '' : 'none';
                            crtUncheck.style.display = this._crtEnabled ? 'none' : '';
                            if (this._crtEnabled) {
                                windowDiv.classList.add('crt');
                            } else {
                                windowDiv.classList.remove('crt');
                            }
                            localStorage.setItem('crtEnabled', this._crtEnabled ? 'true' : 'false');
                        });
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }


            // FULLSCREEN TOGGLE HANDLER
            if (!this._fullscreenHandlerSet) {
                this._fullscreenHandlerSet = true;
                const observer = new MutationObserver(() => {
                    const fullCheckbox = document.getElementById('fullCheckbox');
                    const fullUncheck = document.getElementById('fullUncheck');
                    const fullCheck = document.getElementById('fullCheck');
                    if (fullCheckbox && fullUncheck && fullCheck) {
                        // Sync checkbox state with localStorage
                        let fullEnabled = localStorage.getItem('fullscreenEnabled') === 'true';
                        this._fullscreenEnabled = fullEnabled;
                        fullCheck.style.display = fullEnabled ? '' : 'none';
                        fullUncheck.style.display = fullEnabled ? 'none' : '';
                        if (fullEnabled) {
                            document.documentElement.classList.add('full');
                            if (!this._fitFilterDivHandlerSet) {
                                window.addEventListener('resize', fitFilterDivToViewport);
                                window.addEventListener('DOMContentLoaded', fitFilterDivToViewport);
                                this._fitFilterDivHandlerSet = true;
                            }
                            fitFilterDivToViewport();
                        } else {
                            document.documentElement.classList.remove('full');
                            if (this._fitFilterDivHandlerSet) {
                                window.removeEventListener('resize', fitFilterDivToViewport);
                                window.removeEventListener('DOMContentLoaded', fitFilterDivToViewport);
                                this._fitFilterDivHandlerSet = false;
                            }
                            const filterDiv = document.getElementById('filterDiv');
                            if (filterDiv) {
                                filterDiv.style.transform = '';
                                filterDiv.style.width = '';
                                filterDiv.style.height = '';
                                filterDiv.style.position = '';
                                filterDiv.style.left = '';
                                filterDiv.style.top = '';
                                filterDiv.style.transformOrigin = '';
                            }
                            document.body.style.zoom = "";
                            document.body.style.overflow = '';
                            document.documentElement.style.overflow = '';
                            const windowContainer = document.querySelector('.windowContainer');
                            if (windowContainer) {
                                windowContainer.style.position = '';
                                windowContainer.style.left = '';
                                windowContainer.style.top = '';
                                windowContainer.style.transform = '';
                                windowContainer.style.zIndex = '';
                                windowContainer.style.width = '';
                                windowContainer.style.height = '';
                            }
                        }
                        fullCheckbox.addEventListener('click', () => {
                            this._fullscreenEnabled = !this._fullscreenEnabled;
                            fullCheck.style.display = this._fullscreenEnabled ? '' : 'none';
                            fullUncheck.style.display = this._fullscreenEnabled ? 'none' : '';
                            if (this._fullscreenEnabled) {
                                document.documentElement.classList.add('full');
                                if (!this._fitFilterDivHandlerSet) {
                                    window.addEventListener('resize', fitFilterDivToViewport);
                                    window.addEventListener('DOMContentLoaded', fitFilterDivToViewport);
                                    this._fitFilterDivHandlerSet = true;
                                }
                                fitFilterDivToViewport();
                                window.dispatchEvent(new Event('resize'));
                            } else {
                                document.documentElement.classList.remove('full');
                                if (this._fitFilterDivHandlerSet) {
                                    window.removeEventListener('resize', fitFilterDivToViewport);
                                    window.removeEventListener('DOMContentLoaded', fitFilterDivToViewport);
                                    this._fitFilterDivHandlerSet = false;
                                    window.dispatchEvent(new Event('resize'));
                                }
                                const filterDiv = document.getElementById('filterDiv');
                                if (filterDiv) {
                                    filterDiv.style.transform = '';
                                    filterDiv.style.width = '';
                                    filterDiv.style.height = '';
                                    filterDiv.style.position = '';
                                    filterDiv.style.left = '';
                                    filterDiv.style.top = '';
                                    filterDiv.style.transformOrigin = '';
                                }
                                document.body.style.zoom = "";
                                document.body.style.overflow = '';
                                document.documentElement.style.overflow = '';
                                const windowContainer = document.querySelector('.windowContainer');
                                if (windowContainer) {
                                    windowContainer.style.position = '';
                                    windowContainer.style.left = '';
                                    windowContainer.style.top = '';
                                    windowContainer.style.transform = '';
                                    windowContainer.style.zIndex = '';
                                    windowContainer.style.width = '';
                                    windowContainer.style.height = '';
                                }
                            }
                            localStorage.setItem('fullscreenEnabled', this._fullscreenEnabled ? 'true' : 'false');
                        });
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }

            if (this.fadeOverlayAlpha > 0) {
                ctx.save();
                ctx.globalAlpha = this.fadeOverlayAlpha;
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            document.querySelectorAll('.tab-buttons button').forEach(button => {
            button.addEventListener('click', () => {
              document.querySelectorAll('.tab-buttons button').forEach(b => b.classList.remove('active'));
              document.querySelectorAll('.tab-content .tab').forEach(t => t.classList.remove('active'));

              button.classList.add('active');
              document.getElementById(button.dataset.tab).classList.add('active');
            });
          });
        }
    }
};

// GAMMA SLIDER HANDLER
function setupGammaSlider() {
    const thumb = document.getElementById('gammaThumb');
    const track = thumb ? thumb.parentElement : null;
    if (!thumb || !track) return;

    const minValue = 0.5;
    const maxValue = 1.5;
    const defaultValue = 1.0;

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    let gammaValue = localStorage.getItem('gammaValue');
    gammaValue = gammaValue === null ? defaultValue : parseFloat(gammaValue);
    if (isNaN(gammaValue)) gammaValue = defaultValue;

    function updateThumbPosition(val) {
        if (track.offsetWidth > 0 && thumb.offsetWidth > 0) {
            const trackWidth = track.offsetWidth;
            const thumbWidth = thumb.offsetWidth;
            const minX = 0;
            const maxX = trackWidth - thumbWidth;
            const percent = (val - minValue) / (maxValue - minValue);
            const x = minX + percent * maxX;
            thumb.style.left = `${x}px`;
            thumb._lastLeft = x;
            setGammaFilterOnDiv(val);
        }
    }

    updateThumbPosition(gammaValue);

    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    thumb.onmousedown = null;

    thumb.onmousedown = function(e) {
        dragging = true;
        const trackRect = track.getBoundingClientRect();
        startX = (e.clientX - trackRect.left) * (track.offsetWidth / trackRect.width);
        startLeft = parseFloat(thumb.style.left) || 0;
        document.body.style.userSelect = 'none';
        e.preventDefault();
    };

    function mousemoveHandler(e) {
        if (!dragging) return;
        const trackRect = track.getBoundingClientRect();
        const trackWidth = track.offsetWidth;
        const thumbWidth = thumb.offsetWidth;
        const minX = 0;
        const maxX = trackWidth - thumbWidth;
        let mouseX = (e.clientX - trackRect.left) * (trackWidth / trackRect.width);
        let dx = mouseX - startX;
        let newLeft = clamp(startLeft + dx, minX, maxX);
        const percent = (newLeft - minX) / (maxX - minX);
        let value = minValue + percent * (maxValue - minValue);
        value = Math.round(value * 100) / 100;
        value = clamp(value, minValue, maxValue);
        thumb.style.left = `${newLeft}px`;
        thumb._lastLeft = newLeft;
        localStorage.setItem('gammaValue', value);
        setGammaFilterOnDiv(value);
    }

    function mouseupHandler() {
        if (dragging) {
            dragging = false;
            document.body.style.userSelect = '';
        }
    }

    document.removeEventListener('mousemove', mousemoveHandler);
    document.removeEventListener('mouseup', mouseupHandler);

    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);

    function safeUpdateThumbPosition() {
        let gammaValue = localStorage.getItem('gammaValue');
        gammaValue = gammaValue === null ? defaultValue : parseFloat(gammaValue);
        if (isNaN(gammaValue)) gammaValue = defaultValue;
        updateThumbPosition(gammaValue);
    }

    if (!track._gammaObserver) {
        const observer = new MutationObserver(safeUpdateThumbPosition);
        observer.observe(track, { attributes: true, childList: true, subtree: true });
        track._gammaObserver = observer;
    }

    document.querySelectorAll('.tab-buttons button[data-tab="tab3"]').forEach(btn => {
        if (!btn._gammaListener) {
            btn.addEventListener('click', () => {
                setTimeout(safeUpdateThumbPosition, 0);
            });
            btn._gammaListener = true;
        }
    });

    window.addEventListener('resize', safeUpdateThumbPosition);
}

function observeGammaSlider() {
    const observer = new MutationObserver(() => {
        if (document.getElementById('gammaThumb')) {
            setupGammaSlider();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
observeGammaSlider();

function gammaToCSSFilter(gamma) {
    return gamma;
}

function ensureGammaSVGFilter(gamma) {
    let svg = document.getElementById('gamma-svg-filter');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', 'gamma-svg-filter');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.style.left = '-9999px';
        svg.innerHTML = `
        <filter id="gamma-correction">
            <feComponentTransfer>
                <feFuncR type="gamma" amplitude="1" exponent="1" offset="0"/>
                <feFuncG type="gamma" amplitude="1" exponent="1" offset="0"/>
                <feFuncB type="gamma" amplitude="1" exponent="1" offset="0"/>
            </feComponentTransfer>
        </filter>
        `;
        document.body.appendChild(svg);
    }
    const feFuncR = svg.querySelector('feFuncR');
    const feFuncG = svg.querySelector('feFuncG');
    const feFuncB = svg.querySelector('feFuncB');
    const exp = 1 / gamma;
    if (feFuncR && feFuncG && feFuncB) {
        feFuncR.setAttribute('exponent', exp);
        feFuncG.setAttribute('exponent', exp);
        feFuncB.setAttribute('exponent', exp);
    }
}

function setGammaFilterOnDiv(gamma) {
    ensureGammaSVGFilter(gamma);
    const filterDiv = document.getElementById('filterDiv');
    if (filterDiv) {
        filterDiv.style.filter = 'url(#gamma-correction)';
    }
}

function applyInitialGammaBrightness() {
    const minValue = 0.5;
    const maxValue = 1.5;
    const defaultValue = 1.0;
    let gammaValue = localStorage.getItem('gammaValue');
    gammaValue = gammaValue === null ? defaultValue : parseFloat(gammaValue);
    if (isNaN(gammaValue)) gammaValue = defaultValue;
    gammaValue = Math.max(minValue, Math.min(maxValue, gammaValue));
    setGammaFilterOnDiv(gammaValue);
}

// --- FULLSCREEN/CRT ON GAME START ---
function applyInitialFullscreen() {
    const fullEnabled = localStorage.getItem('fullscreenEnabled') === 'true';
    if (fullEnabled) {
        document.documentElement.classList.add('full');
        if (typeof fitFilterDivToViewport === 'function') fitFilterDivToViewport();
    } else {
        document.documentElement.classList.remove('full');
        if (typeof fitFilterDivToViewport === 'function') {
            const filterDiv = document.getElementById('filterDiv');
            if (filterDiv) {
                filterDiv.style.transform = '';
                filterDiv.style.width = '';
                filterDiv.style.height = '';
                filterDiv.style.position = '';
                filterDiv.style.left = '';
                filterDiv.style.top = '';
                filterDiv.style.transformOrigin = '';
            }
            const windowContainer = document.querySelector('.windowContainer');
            if (windowContainer) {
                windowContainer.style.position = '';
                windowContainer.style.left = '';
                windowContainer.style.top = '';
                windowContainer.style.transform = '';
                windowContainer.style.zIndex = '';
                windowContainer.style.width = '';
                windowContainer.style.height = '';
            }
        }
    }
    window.dispatchEvent(new Event('resize'));
}

function applyInitialCRT() {
    const crtEnabled = localStorage.getItem('crtEnabled') === 'true';
    const filterDiv = document.getElementById('filterDiv');
    if (filterDiv) {
        if (crtEnabled) {
            filterDiv.classList.add('crt');
        } else {
            filterDiv.classList.remove('crt');
        }
    }
}
