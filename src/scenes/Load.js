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

        // load background
        this.load.image("bckg", "img/Background.png");
        this.load.image("outer", "img/Outline.png");
        this.load.image("rocks", "img/rocks.png");
        this.load.image("light", "img/lighting.png");

    }

    create() {
        // Rumble attack anims
        this.anims.create({
            key: "RMfir",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'RMfir',
                start: 1,
                end: 3,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "RMsec",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'RMsec',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "RMpow",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'RMpow',
                start: 1,
                end: 3,
            }),
            frameRate: 5,
            repeat: -1
        })

        // Dr attack anims
        this.anims.create({
            key: "DRfir",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'DRfir',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "DRsec",
            frames: this.anims.generateFrameNames('attacks', {
                prefix: 'DRsec',
                start: 1,
                end: 4,
            }),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "DRpow",
            frames: this.anims.generateFrameNames('attacks', {
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

        this.scene.start("menuScene");
    }
}