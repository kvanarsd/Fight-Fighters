class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // load assets
        this.load.path = "./assets/"

        // load JSON (ie dialog text)
        this.load.json('dialog', 'json/dialog.json')

        // load images

    }

    create() {
        this.scene.start("menuScene");
    }
}