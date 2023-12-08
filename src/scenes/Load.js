class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // load assets
        this.load.path = "./assets/"

        // load JSON (ie dialog text)
        this.load.json('dialog', 'json/dialog.json')

        // load fonts
        this.load.bitmapFont('midnew', 'fonts/midnewbmp.png', 'fonts/midnewbmp.xml')

        // load sprites
        this.load.spritesheet("character", "img/Character_002.png", {
            frameWidth: 48
        })

        this.load.atlas('attacks', 'img/attackAnims.png', 'json/attackAnims.json')
        this.load.atlas('attacksF', 'img/attackAnimsFlip.png', 'json/attackAnimsFlip.json')

        // load background
        this.load.image("menu1", "img/Menu.png");
        this.load.image("menu2", "img/Instructions.png");
        this.load.image("bckg", "img/Background.png");
        this.load.image("outer", "img/Outline.png");
        this.load.image("rocks", "img/rocks.png");
        this.load.image("light", "img/lighting.png");

        // health bar
        this.load.image("bar", "img/healthBar.png");
        this.load.image("health", "img/health.png");

        // load sounds
        this.load.audio("hurt", "sounds/hurt.wav");

    }

    create() {
        // Rumble attack anims
        this.anims.create({
            key: "RMfir-right",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'RMfir',
                start: 1,
                end: 3,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "RMsec-right",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'RMsec',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "RMpow-right",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'RMpow',
                start: 1,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1
        })

        // left
        this.anims.create({
            key: "RMpow-left",
            frames: this.anims.generateFrameNames('attacksF', {
                prefix: 'RMpow',
                start: 1,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: "RMfir-left",
            frames: this.anims.generateFrameNames('attacksF', {
                prefix: 'RMfir',
                start: 1,
                end: 3,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "RMsec-left",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'RMsec',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: -1
        })

        // Dr attack anims
        this.anims.create({
            key: "DRfir-left",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'DRfir',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "DRsec-left",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'DRsec',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "DRpow-left",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'DRpow',
                start: 1,
                end: 7,
            }),
            frameRate: 5,
            repeat: 0
        })

        // right
        this.anims.create({
            key: "DRfir-right",
            frames: this.anims.generateFrameNames('attacksF', {
                prefix: 'DRfir',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "DRsec-right",
            frames: this.anims.generateFrameNames('attacksF', {
                prefix: 'DRsec',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "DRpow-right",
            frames: this.anims.generateFrameNames('attacksF', {
                prefix: 'DRpow',
                start: 1,
                end: 7,
            }),
            frameRate: 5,
            repeat: 0
        })


        // Rumble Animations
        this.anims.create({
            key: "RM-idle-right",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 7,
                end: 7
            })
        })

        this.anims.create({
            key: "RM-idle-left",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 4,
                end: 4
            })
        })

        this.anims.create({
            key: "RM-run-right",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 6,
                end: 8
            })
        })

        this.anims.create({
            key: "RM-run-left",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 3,
                end: 5
            })
        })

        this.anims.create({
            key: "RM-nAttack-right",
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        })
        this.anims.create({
            key: "RM-jump-right",
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        })

        this.anims.create({
            key: "RM-hurt-right",
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        })

        this.anims.create({
            key: "RM-hurt-left",
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        })
        
        // Dr Animations
        this.anims.create({
            key: "DK-idle-right",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 7,
                end: 7
            })
        })

        this.anims.create({
            key: "DK-idle-left",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 4,
                end: 4
            })
        })

        this.anims.create({
            key: "DK-run-right",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 6,
                end: 8
            })
        })

        this.anims.create({
            key: "DK-run-left",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 3,
                end: 5
            })
        })

        this.anims.create({
            key: "DK-nAttack-left",
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        })

        this.anims.create({
            key: "DK-hurt-right",
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        })

        this.anims.create({
            key: "DK-hurt-left",
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        })

        this.anims.create({
            key: "DK-jump-left",
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        })

        this.scene.start("menuScene");
    }
}