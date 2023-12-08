class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
    }

    create() {
        game.settings = {
            health: 1000,
            points: 200,
            speed: 300,
            gravity: 700,
            jump: -500
        }

        // background images
        this.bckg = this.add.image(0,0,'menu1').setOrigin(0,0);
        this.bckg2 = this.add.image(game.config.width,0,'menu2').setOrigin(0,0);
        const outline = this.add.image(0,0,"outer", 0).setOrigin(0,0).setScale(0.75);
        const light = this.add.image(0,0,"light", 0).setOrigin(0,0).setScale(0.75);
        // depth
        outline.setDepth(10)
        light.setDepth(11)

        // menu one text
        this.name = this.add.bitmapText(borderPadding/1.5, borderPadding / 1.1, 'midnew', 'FIGHT \nFIGHTERS', 52, 0).setOrigin(0,0);
        this.start = this.add.bitmapText(borderPadding/1.5, borderPadding*2, 'midnew', 'START', 42, 0).setOrigin(0,0);
        this.button = this.add.bitmapText(borderPadding/1.5, borderPadding*2.5, 'midnew', 'Press V or P \nto start!', 22, 0).setOrigin(0,0);
        this.cents = this.add.bitmapText(borderPadding/1.5, game.config.height- borderPadding / 1.1, 'midnew', '25 cents', 48, 0).setOrigin(0,0);

        // menu one text
        this.creds = this.add.bitmapText(game.config.width/2, - borderPadding*2, 'midnew', 'CREDITS', 42, 1).setOrigin(0.5,0.5);
        this.gameBy = this.add.bitmapText(game.config.width/2, - borderPadding, 'midnew', 'Game by Katrina VanArsdale\n Art by Katrina VanArsdale\n Music by\n Sound by\n', 32, 1).setOrigin(0.5,0.5);
        this.gameBy.lineSpacing = 20

        // menu three text player 1
        this.instructions = this.add.bitmapText(game.config.width/2, - borderPadding*2, 'midnew', 'INSTRUCTIONS', 42, 1).setOrigin(0.5,0.5);
        this.player1 = this.add.bitmapText(borderPadding/1.5, - borderPadding*1.5, 'midnew', 'PLAYER 1', 32, 1).setOrigin(0,0.5);
        this.buttons1 = this.add.bitmapText(borderPadding/1.5, - borderPadding/1.2, 'midnew', 'WASD for movement\nC for NORMAL ATTACK\nC x2 for SECOND \nATTACK\nV for POWER UP', 20, 0).setOrigin(0,0.5);
        this.buttons1.lineSpacing = 20
        // player 2
        this.player2 = this.add.bitmapText(game.config.width - borderPadding /1.5, - borderPadding*1.5, 'midnew', 'PLAYER 2', 32, 1).setOrigin(1,0.5);
        this.buttons2 = this.add.bitmapText(game.config.width - borderPadding/1.5, - borderPadding/1.2, 'midnew', 'ARROWS for movement\nO for NORMAL ATTACK\nO x2 for SECOND \nATTACK\nP for POWER UP', 20, 2).setOrigin(1,0.5);
        this.buttons2.lineSpacing = 20


        // keys
        V = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V)
        P = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)

        // animate start screen text
        var menu1Text = this.tweens.add({
            targets: [this.start, this.cents, this.button],
            duration: 400,
            ease: 'Linear',
            repeat: -1,
            yoyo: true,
            scaleX: 1.025,
            scaleY: 1.025
        });


        let music = this.sound.add('music', {volume: 0.3})
        music.loop = true
        music.play()

        this.number = 1;
    }   

    update() {
        if(Phaser.Input.Keyboard.JustDown(V) || Phaser.Input.Keyboard.JustDown(P)) {
            if(this.number == 1) {
                this.sound.play('menuSelect')
                var menu1away = this.tweens.add({
                    targets: [this.bckg, this.name, this.start, this.cents, this.button],
                    duration: 800,
                    ease: 'Linear',
                    repeat: 0,
                    x: -game.config.width,
                });
                var menu2in = this.tweens.add({
                    targets: this.bckg2,
                    duration: 800,
                    ease: 'Linear',
                    repeat: 0,
                    x: 0,
                });

                var textIn = this.tweens.add({
                    targets: [this.creds, this.gameBy],
                    duration: 800,
                    ease: 'Linear',
                    repeat: 0,
                    y: "+= 300",
                });

                // next menu
                this.time.delayedCall(100, () => {
                    this.number = 2;
                })
            }

            if(this.number == 2) {
                this.sound.play('menuSelect')
                var textOut = this.tweens.add({
                    targets: [this.creds, this.gameBy],
                    duration: 800,
                    ease: 'Linear',
                    repeat: 0,
                    y: "-= 300",
                });

                var textIn = this.tweens.add({
                    targets: [this.instructions, this.player1, this.player2, this.buttons1, this.buttons2],
                    duration: 800,
                    ease: 'Linear',
                    repeat: 0,
                    y: "+= 300",
                });

                // next menu
                this.time.delayedCall(100, () => {
                    this.number = 3;
                })
            }

            if(this.number == 3) {
                this.sound.play('menuSelect')
                // snap shot code from Nathan Altice Paddle Parkour
                let textureManager = this.textures;
                this.game.renderer.snapshot((snapshotImage) => {
                    if(textureManager.exists('titlesnapshot')) {
                        textureManager.remove('titlesnapshot');
                    }

                    textureManager.addImage('titlesnapshot', snapshotImage);
                });

                this.scene.start("playScene");
            }
        }
    }
}