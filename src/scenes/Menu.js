class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
    }

    create() {
        let menuConfig = {
            fontFamily: "Garamond Bold",
            fontSize: "32px",
            backgroundColor: "#fff",
            color: "#cc2570",
            align: "right",
            padding: {
                tom: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.bckg = this.add.image(0,0,'menu1').setOrigin(0,0);

        let Config = {
            fontFamily: "Garamond Bold",
            fontSize: "28px",
            backgroundColor: "#c8d3e6",
            color: "#535e70",
            align: "right",
            padding: {
                tom: 5,
                bottom: 5,
            }
        }
        this.start = this.add.text((game.config.width)/1.5, game.config.height - borderUISize - borderPadding * 2, "Press SPACE to start!", Config);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        // let music = this.sound.add('intro')
        // music.loop = true
        // music.play()

        this.number = 1;
    }   

    update() {
        // console.log(Phaser.Input.Keyboard.JustDown(keySPACE))
        // console.log("Second " + Phaser.Input.Keyboard.JustDown(keySPACE))
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            if(this.number == 1) {
                this.bckg.setTexture('menu2')
                this.start.setVisible(false)
                this.time.delayedCall(100, () => {
                    this.number = 2;
                })
                console.log(2)
            }

            if(this.number == 2) {
                this.bckg.setTexture('menu3')
                this.start.setVisible(false)
                keySPACE.reset();
                this.time.delayedCall(100, () => {
                    this.number = 3;
                })
                console.log(3)
            }

            if(this.number == 3) {
                console.log(4)
                game.settings = {
                    health: 1000,
                    points: 200,
                    speed: 300,
                    gravity: 700,
                    jump: -400
                }
                this.scene.start("playScene");
            }
        }
    }
}