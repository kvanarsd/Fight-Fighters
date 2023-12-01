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

        // load imgs
        this.load.spritesheet("character", "img/Character_002.png", {
            frameWidth: 48
        })

    }

    create() {
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
        this.scene.start("menuScene");
    }
}