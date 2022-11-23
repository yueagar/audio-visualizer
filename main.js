((e, $, o) => {
    const A = new class {
        constructor() {
            this.version = "1.0.0",
            this.author = "YueAgar_c",
            this.init()
        }
        init() {
            this.canvas = o.getElementById("canvas"),
            this.selection = o.getElementById("selection"),
            this.selected = this.selection.value || 3,
            this.songs = [{
                "id": 0,
                "name": "USSR 1945",
                "audio": "ussr1945.mp4",
                "bg": "ussr.png",
                "color1": 0xff0000,
                "color2": 0xffff00
            }, {
                "id": 1,
                "name": "USSR 1967",
                "audio": "ussr1967.mp4",
                "bg": "ussr.png",
                "color1": 0xff0000,
                "color2": 0xffff00
            }, {
                "id": 2,
                "name": "USSR 1985",
                "audio": "ussr1985.mp4",
                "bg": "ussr.png",
                "color1": 0xff0000,
                "color2": 0xffff00
            }, {
                "id": 3,
                "name": "USSR 1990",
                "audio": "ussr1990.mp4",
                "bg": "ussr.png",
                "color1": 0xff0000,
                "color2": 0xffff00
            }, {
                "id": 4,
                "name": "Glory to Hong Kong",
                "audio": "gloryhk.mp4",
                "bg": "hk.png",
                "color1": 0xcccccc,
                "color2": 0xffffff
            }],
            this.audio = {
                ctx: new AudioContext(),
                sound: {
                    url: this.songs[this.selected].audio || "ussr1990.mp4",
                    loop: true
                },
                request: new XMLHttpRequest(),
                data: {}
            },
            this.selection.addEventListener("change", () => {
                //console.log("[Class A] Changing song..."),
                $("#play").show(),
                this.bgPlayed = false,
                this.selected = this.selection.value || 3,
                this.audio.ctx.state === "running" && this.audio.sound.source.stop(),
                this.audio.sound.url = this.songs[this.selected].audio || this.songs[3].audio,
                this.canvas.addEventListener("click", A.play),
                o.getElementById("play").addEventListener("click", A.play),
                o.body.style.cursor = "pointer",
                this.firstReady && (this.firstReady = false),
                this.handleBuffer()
            }),
			this.firstReady = !0,
            this.handleBuffer()//,
            //console.log("[Class A] Initializing...")
        }
        handleBuffer() {
            this.audio.sound.source = this.audio.ctx.createBufferSource(),
            this.audio.sound.volume = this.audio.ctx.createGain(),
            this.audio.sound.panner = this.audio.ctx.createPanner(),
            this.audio.data.analyser = this.audio.ctx.createAnalyser(),
            this.audio.request.open("GET", this.audio.sound.url, true),
            this.audio.request.responseType = "arraybuffer",
            this.audio.request.onload = e => {
                this.audio.ctx.decodeAudioData(this.audio.request.response, buf => {
                    this.audio.sound.buffer = buf,
                    this.audio.sound.source.buffer = this.audio.sound.buffer//,
                    //this.audio.sound.source.start(0)
                }, err => {
                    console.error("[Class A] Error occured when handling audio buffer! Error: " + err)
                })
            },
            this.audio.request.send(),
            this.audio.sound.source.connect(this.audio.sound.volume),
            this.audio.sound.volume.connect(this.audio.sound.panner),
            this.audio.sound.volume.connect(this.audio.data.analyser),
            this.audio.sound.panner.connect(this.audio.ctx.destination),
            this.audio.sound.source.loop = true,
            this.audio.sound.panner.setPosition(0, 0, 1),
            this.audio.sound.source.playbackRate.value = 1,
            this.audio.data.analyser.fftSize = 256,
            this.audio.data.buffer_length = this.audio.data.analyser.frequencyBinCount,
            this.audio.data.buffer_array = new Uint8Array(this.audio.data.buffer_length),
            this.audio.data.analyser.getByteFrequencyData(this.audio.data.buffer_array),
            //console.log(this.audio.data.buffer_array),
            this.readyDraw()//,
            //console.log("[Class A] Handling audio buffer...")
        }
        readyDraw() {
            this.renderer = new PIXI.Renderer({
                view: this.canvas,
                width: e.innerWidth,
                height: e.innerHeight,
                resolution: e.devicePixelRatio,
                backgroundColor: 0x000000,
                autoDensity: !0,
                antialias: !0
            }),
            e.onresize = () => {
                this.canvas.width = 0 | e.innerWidth,
                this.canvas.height = 0 | e.innerHeight,
                this.renderer.resize(this.canvas.width, this.canvas.height)
            },
            this.scale = .75,
            this.viewport = .75,
            this.mouse = {
                x: 0,
                y: 0
            },
            this.pos = {
                x: 0,
                y: 0
            },
            this.globalRotation = 0,
            this.nodes = [],
            this.stars = [],
            /*this.bgImg = new Image(),
            this.bgImg.crossOrigin = "anonymous",
            this.bgImg.src = "https://i.imgur.com/T8xZTh7.png",*/
            this.suPic = PIXI.Sprite.from(this.songs[this.selected].bg),
            this.bgPlayed = false,
            this.bgVideo = PIXI.Texture.from(this.songs[this.selected].audio),
            this.bgVideo.baseTexture.resource.source.volume = 0,
            this.bgVideo.baseTexture.resource.source.playbackRate = 1,
            this.bgVideo.baseTexture.resource.source.currentTime = 0,
            this.bgPlayed || this.bgVideo.baseTexture.resource.source.pause(),
            this.bgVideo.baseTexture.resource.source.loop || (this.bgVideo.baseTexture.resource.source.loop = true),
            this.mainContainer = new PIXI.Container(),
            this.rootContainer = new PIXI.Container(),
            this.bgSprite = PIXI.Sprite.from(this.bgVideo),
            this.graphics = new PIXI.Graphics(),
            this.nodeImg = PIXI.Texture.WHITE,
            this.starImg = PIXI.Texture.from("star.png"),
            this.firstReady && (this.loop = new PIXI.Ticker(),
            this.loop.add(delta => {
                this.draw(delta)
            }),
            this.loop.start());
            for (let i = 0; i < 128; i++) {
                this.nodes[i] = {
                    x: (e.innerWidth / 128) * i,
                    y: e.innerHeight / 2 - 10,
                    w: 20,
                    h: 10
                },
                this.stars[i] = {
                    x: 0,
                    //animX: 0,
                    y: 0,
                    //animY: 0,
                    w: 0,
                    h: 0,
                    vel: 0,
                    dir: 0,
                    alpha: 1
                }
            };
            o.getElementById("play").addEventListener("click", this.play),
            this.canvas.addEventListener("click", this.play),
            this.canvas.addEventListener("wheel", e => {
                0 > e.wheelDelta && this.scale > 0.2 ? this.scale *= 88 / 100 : 0 < e.wheelDelta && this.scale < 1 ? this.scale /= 88 / 100 : this.scale
            }),
            this.canvas.addEventListener("mousemove", e => {
                this.mouse.x = this.canvas.width/2 + e.x - this.canvas.width,
                this.mouse.y = this.canvas.height/2 + e.y - this.canvas.height
            }),
            o.body.style.cursor = "pointer"//,
            //console.log("[Class A] Readying to draw visualizer...")
        }
        draw(delta) {
            this.bgPlayed || this.bgVideo.baseTexture.resource.source.pause(),
            $("#stats").html(`FPS: ${Math.round(this.loop.FPS) || 0}<br>Time: ${new Date()}`),
            this.globalRotation += delta,
            this.viewport += (this.scale - this.viewport) / 8,
            this.pos.x += (this.mouse.x - this.pos.x) / 16,
            this.pos.y += (this.mouse.y - this.pos.y) / 16,
            this.mainContainer.removeChildren(),
            this.rootContainer.removeChildren(),
            this.graphics.clear(),
            this.graphics.beginFill(this.songs[this.selected].color2, .5),
            this.graphics.drawCircle(this.canvas.width/2, this.canvas.height/2, this.canvas.height/5),
            this.graphics.endFill(),
            this.graphics.beginFill(0, 0),
            this.graphics.lineStyle(this.canvas.height/50, this.songs[this.selected].color1, .5),
            this.graphics.drawCircle(this.canvas.width/2, this.canvas.height/2, this.canvas.height/5 - this.canvas.height/100),
            this.graphics.lineStyle(0),
            this.graphics.endFill(),
            this.suPic.anchor.set(.5, .5),
            //this.suPic.rotation += .01 * delta,
            this.suPic.alpha = .5,
            this.suPic.position.set(this.canvas.width/2, this.canvas.height/2),
            this.suPic.tint = this.songs[this.selected].color1,
            this.suPic.width = this.suPic.height = this.canvas.height/5,
            this.bgSprite.width = /*200 + */this.canvas.width,
            this.bgSprite.height = /*200 + */this.canvas.height,
            this.bgSprite.alpha = .25,
            this.bgSprite.position.set(0, 0),
            this.rootContainer.addChild(this.bgSprite),
            this.mainContainer.addChild(this.graphics, this.suPic);
            for (let i = 0; i < (this.nodes.length || this.stars.length || 128); i++) {
                const nodeSprite = new PIXI.Sprite.from(this.nodeImg);
                if (i % 2 == 0) {
                    nodeSprite.tint = this.songs[this.selected].color1
                } else {
                    nodeSprite.tint = this.songs[this.selected].color2
                };
                nodeSprite.alpha = .5,
                nodeSprite.position.set(this.canvas.width/2 + Math.cos(i/128 * 2 * Math.PI) * (this.canvas.height/5 + 20), this.canvas.height/2 + Math.sin(i/128 * 2 * Math.PI) * (this.canvas.height/5 + 20)),
                nodeSprite.rotation = i/128 * 2 * Math.PI,
                nodeSprite.width = this.nodes[i].w,
                nodeSprite.height = this.nodes[i].h,
                this.mainContainer.addChild(nodeSprite);
                const starSprite = new PIXI.Sprite.from(this.starImg);
                this.stars[i].x === 0 ? (this.stars[i].x = Math.random() * this.canvas.width) : (this.stars[i].x += Math.random() * this.stars[i].dir),
                this.stars[i].y === 0 ? (this.stars[i].y = 1) : (this.stars[i].y += this.stars[i].vel),
                this.stars[i].w === 0 && (this.stars[i].w = 10 * Math.random()),
                this.stars[i].h === 0 && (this.stars[i].h = 10 * Math.random()),
                this.stars[i].vel === 0 && (this.stars[i].vel = 1 / Math.random()),
                this.stars[i].dir === 0 && (this.stars[i].dir = Math.random() > .5 ? 1 : -1)
                this.stars[i].alpha === 0 && (this.stars[i].alpha = 1 * Math.random()),
                this.stars[i].y > this.canvas.height && (
                    this.stars[i].x = 0,
                    this.stars[i].y = 0,
                    this.stars[i].w = 0,
                    this.stars[i].h = 0,
                    this.stars[i].vel = 0,
                    this.stars[i].dir = 0,
                    this.stars[i].alpha = 0
                ),
                //this.stars[i].animX += (this.stars[i].x - this.stars[i].animX)/8,
                //this.stars[i].animY += (this.stars[i].y - this.stars[i].animY)/8,
                starSprite.tint = this.songs[this.selected].color2,
                starSprite.x = this.stars[i].x,
                starSprite.y = this.stars[i].y,
                starSprite.width = this.stars[i].w,
                starSprite.height = this.stars[i].h,
                starSprite.alpha = this.stars[i].alpha,
                starSprite.anchor.set(.5, .5),
                starSprite.rotation += .01 * this.stars[i].dir * this.stars[i].vel * this.globalRotation,
                this.rootContainer.addChild(starSprite);
            };
            this.audio.data.analyser.getByteFrequencyData(this.audio.data.buffer_array);
            for (let i = 0; i < this.audio.data.buffer_length; i++) {
                this.nodes[i].x = (e.innerWidth / 128) * i,
                this.nodes[i].y = e.innerHeight / 2 - 10 - this.audio.data.buffer_array[i]/5,
                this.nodes[i].w = 20 + this.audio.data.buffer_array[i%25*3],
                this.nodes[i].h = 10
            };
            this.mainContainer.scale.set(this.viewport, this.viewport),
            this.mainContainer.position.set(this.canvas.width*(1-this.viewport)/2-(this.pos.x/20), this.canvas.height*(1-this.viewport)/2-(this.pos.y/20)),
            this.rootContainer.addChild(this.mainContainer),
            this.renderer.render(this.rootContainer)
        }
        play() {
            $("#play").hide(),
            A.bgPlayed = true,
            A.bgSprite.texture.baseTexture.resource.source.play(),
            A.canvas.removeEventListener("click", A.play),
            o.getElementById("play").removeEventListener("click", A.play),
            o.body.style.cursor = "inherit",
            A.audio.sound.source.start(0)
        }
    };
    e.A = A;
})(window, jQuery, document);