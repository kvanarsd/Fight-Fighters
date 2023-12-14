class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // game settings
        this.height = game.config.height;
        this.width = game.config.width;

        // prior scene snap shot
        if (this.textures.exists('titlesnapshot')) {
            let titleSnap = this.add.image(this.width/2, this.height/2, 'titlesnapshot').setOrigin(0.5);
            titleSnap.setDepth(8)
            let fade = this.tweens.add({
                targets: titleSnap,
                duration: 500,
                alpha: { from: 1, to: 0 },
                repeat: 0
            });
        } else {
            console.log('texture error');
        }

        // fight!
        let fight = this.add.bitmapText(this.width/2, this.height/2 - borderPadding/2, 'midnew', 'FIGHT!', 74, 1).setOrigin(0.5,0.5).setAlpha(0);
        fight.setDepth(12);
        this.tweens.add({
            targets: fight,
            duration: 200,
            ease: 'Linear',
            repeat: 0,
            yoyo: false,
            delay: 400,
            alpha: { from: 0, to: 1 },
        });
        this.tweens.add({
            targets: fight,
            duration: 500,
            ease: 'Linear',
            repeat: 0,
            yoyo: false,
            delay: 1300,
            alpha: { from: 1, to: 0},
        });

        // game over variables
        this.gameOver = false;
        this.tweenStarted = false;

        // background
        const background = this.add.image(0,0,"bckg", 0).setOrigin(0,0).setScale(0.75);
        const rocks = this.add.image(0,0,"rocks", 0).setOrigin(0,0).setScale(0.75);
        const outline = this.add.image(0,0,"outer", 0).setOrigin(0,0).setScale(0.75);
        this.light = this.add.image(0,0,"light", 0).setOrigin(0,0).setScale(0.75);

        rocks.setDepth(9)
        outline.setDepth(10)

        // lighting
        this.light.setDepth(11)
        this.light.setAlpha(0.5)
        this.lightDim = true

        // Dr Karate keys
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.OKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
        this.keys.PKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)

        // Rumble keys
        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keys.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keys.CKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
        this.keys.VKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V)

        // players
        this.Rumble = new RM(this, this.width/4, this.height - borderPadding*2, "characters", 'RMidle1').setOrigin(0.5,0.5).setScale(0.8);
        this.Rumble.setSize(this.Rumble.width/3, this.Rumble.height/1.5).setOffset(this.Rumble.width/5,this.Rumble.height/3.1)
        this.Dr = new DK(this, 3*this.width/4, this.height - borderPadding*2, "characters", 'DKidle1').setScale(0.8).setOrigin(0.5,0.5);
        this.Dr.setSize(this.Dr.width/3.5, this.Dr.height/1.5).setOffset(this.Dr.width/2.2,this.Dr.height/3.1)
        
        // player health bars
        this.barLeft = this.add.image(borderPadding * 2.7, borderPadding*0.8, "bar").setOrigin(1,0.5);
        this.barRight = this.add.image(this.width - borderPadding * 2.7, borderPadding*0.8, "bar").setOrigin(0,0.5);
        this.Rumble.healthBar = this.add.image(borderPadding * 2.7, borderPadding*0.8, "health").setOrigin(1,0.5);
        this.Dr.healthBar = this.add.image(this.width - borderPadding * 2.7, borderPadding*0.8, "health").setOrigin(0,0.5);
        
        // player names
        var RMname = this.add.bitmapText(borderPadding * 1.75, borderPadding*1.05, 'midnew', "Rumble", 24, 1).setOrigin(1,0.5);
        RMname.letterSpacing = 5
        var DKname = this.add.bitmapText(this.width - borderPadding / 1.25, borderPadding*1.05, 'midnew', "Dr. Karate", 24, 1).setOrigin(1,0.5);
        DKname.letterSpacing = 5

        // ground collisiond
        const ground = this.add.rectangle(0, this.height - borderPadding/1.2 , this.width, 0).setOrigin(0,0)
        this.physics.add.existing(ground, true)

        this.physics.add.collider(ground, this.Rumble, () => {
            this.onFloor = true;
        })
        this.physics.add.collider(ground, this.Dr)

        // parse dialog from JSON file
        this.dialog = this.cache.json.get('dialog')

        // dialog variables
        this.dialogConvo = 0			// current "conversation"
        this.dialogLine = 0			    // current line of conversation
        this.dialogSpeaker = null		// current speaker
        this.dialogWord = 0             // current word
        this.dialogText = null			// the actual dialog text
        this.dialogTalking = false;
        this.dialogConvos = this.dialog.length - 1
        this.dialogLines = null         // amount of lines in convo
        this.dialogWords = null         // amount of words to iterate through

        // random timer for starting convos
        this.convoTimer = this.time.addEvent({
            delay: 200,
            callback: this.convoStarter,
            callbackScope: this,
            loop: true
        });

        // attacks out of bounds
        this.RmiddleBound = new Phaser.Geom.Rectangle(0, 0, this.width/2 - borderPadding/2, this.height);
        this.DmiddleBound = new Phaser.Geom.Rectangle(this.width/2 + borderPadding/2, 0, this.width/2 - borderPadding/2, this.height);
 
        this.Rumble.body.setBoundsRectangle(this.RmiddleBound)
        this.Dr.body.setBoundsRectangle(this.DmiddleBound)

        // power up indicator
        this.powUpV = this.add.image(borderPadding/1.2, this.height - borderPadding/1.2, "Vup").setOrigin(0.5,0.5).setScale(2);
        this.powUpP = this.add.image(this.width - borderPadding/1.2, this.height - borderPadding/1.2, "Pup").setOrigin(0.5,0.5).setScale(2);
        this.powUpP.setDepth(9)
        this.powUpV.setDepth(9)
        this.powUpP.setVisible(false)
        this.powUpV.setVisible(false)

    }

    update() {
        //console.log(this.Rumble.doubleJump + " " +this.Dr.doubleJump)
        if(!this.gameOver) {
            this.Rumble.state.step();
            this.Dr.state.step();

            // change hitbox offset depending on direction
            if(this.Rumble.direction == 'right' && this.Rumble.state.state != "duck") {
                this.Rumble.setOffset(this.Rumble.width/5,this.Rumble.height/3.1)
            } else if (this.Rumble.state.state != "duck"){
                this.Rumble.setOffset(this.Rumble.width/2.5,this.Rumble.height/3.1)
            }

            if(this.Dr.direction == 'left' && this.Dr.state.state != "duck") {
                this.Dr.setOffset(this.Dr.width/2.2,this.Dr.height/3.1)
            } else if(this.Dr.state.state != "duck"){
                this.Dr.setOffset(this.Dr.width/4.4,this.Dr.height/3.1)
            }

            // check still talking 
            if(this.dialogTalking) {
                // if at end of current line
                if(this.dialogWord >= this.dialogWords.length) {
                    // if convo still has lines
                    if(this.dialogLine < this.dialogLines) {
                        this.dialogLine++;
                        this.dialogWord = 0;
                        this.dialogWords = this.dialog[this.dialogConvo][this.dialogLine]['dialog'].split(" ");

                        if(this.dialog[this.dialogConvo][this.dialogLine]['newSpeaker']) {
                            this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker']
                        }
                    } else { // no more lines - end convo
                        this.dialogTalking = false;
                        this.convoTimer.paused = false;
                    }
                }
            }

            // iterate by attack
            if(this.Rumble.attacking && this.dialogTalking && this.dialogSpeaker == "RM" && !this.Rumble.spoken) {
                this.lightingAnim()
                this.Rumble.spoken = true;
                const texture = "RM" + this.Rumble.state.state + "-" + this.Rumble.direction
                const talk = new Attack(this, this.Rumble.x, this.Rumble.y - 40, texture, 0, this.Rumble, this.Rumble.direction, this.Dr, this.dialogWords[this.dialogWord])
                this.dialogWord++;
            } else if(this.Rumble.attacking && !this.Rumble.spoken) {
                this.lightingAnim()
                this.Rumble.spoken = true;
                const texture = "RM" + this.Rumble.state.state + "-" + this.Rumble.direction
                const talk = new Attack(this, this.Rumble.x, this.Rumble.y - 40, texture, 0, this.Rumble, this.Rumble.direction, this.Dr, "")
            }

            if(this.Dr.attacking && this.dialogTalking && this.dialogSpeaker == "DK" && !this.Dr.spoken) {
                this.lightingAnim()
                this.Dr.spoken = true;
                const texture = "DR" + this.Dr.state.state + "-" + this.Dr.direction
                const talk = new Attack(this, this.Dr.x, this.Dr.y - 40, texture, 0, this.Dr, this.Dr.direction, this.Rumble, this.dialogWords[this.dialogWord])
                this.dialogWord++;
            } else if(this.Dr.attacking && !this.Dr.spoken) {
                this.lightingAnim()
                this.Dr.spoken = true;
                const texture = "DR" + this.Dr.state.state + "-" + this.Dr.direction
                const talk = new Attack(this, this.Dr.x, this.Dr.y - 40, texture, 0, this.Dr, this.Dr.direction, this.Rumble, "")
            }

            // end convo if speaker is hurt
            if(this.dialogSpeaker == "RM" && this.Rumble.hurt && this.dialogWord != 0) {
                this.dialogTalking = false;
                this.convoTimer.paused = false;
            }

            if(this.dialogSpeaker == "DK" && this.Dr.hurt && this.dialogWord != 0) {
                this.dialogTalking = false;
                this.convoTimer.paused = false;
            }

            // power up
            if(this.Rumble.powScore >= 200) {
                this.powUpV.setVisible(true)
                this.powAnim(this.powUpV)
                this.Rumble.powScore = 0
                this.Rumble.powerUp = true
            } else if(this.Rumble.powerUp == false) {
                this.powUpV.setVisible(false)
            }
            if(this.Dr.powScore >= 200) {
                this.powUpP.setVisible(true)
                this.powAnim(this.powUpP)
                this.Dr.powerUp = true
                this.Dr.powScore = 0
            } else if(this.Dr.powerUp == false) {
                this.powUpP.setVisible(false)
            }
        } else {
            // game over
            if(!this.tweenStarted) {
                this.endTextstart();
            }
            
            if(Phaser.Input.Keyboard.JustDown(this.keys.VKey) || Phaser.Input.Keyboard.JustDown(this.keys.PKey)) {
                this.scene.restart();
            }

            let backMenu = this.time.delayedCall(10000, () => {
                this.scene.start("menuScene");
            })

        }
    }

    convoStarter() {
        this.tips()
        this.convoTimer.delay = Phaser.Math.Between(200, 1000);
        this.convoTimer.paused = true;

        this.dialogConvo = Phaser.Math.Between(0, this.dialogConvos);
        this.dialogTalking = true;
        this.dialogLines = this.dialog[this.dialogConvo].length - 1
        this.dialogLine = 0;
        this.dialogWord = 0;
        this.dialogWords = this.dialog[this.dialogConvo][this.dialogLine]['dialog'].split(" ");
        this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker']
        console.log(this.dialogWords)
        console.log(this.dialog[this.dialogConvos][this.dialogLine]['dialog'])

    }

    endTextstart() {
        let over = this.add.bitmapText(this.width/2, this.height/2 - borderPadding/2, 'midnew', 'GAMEOVER', 52, 1).setOrigin(0.5,0.5);
        let coin = this.add.bitmapText(this.width/2, this.height/2, 'midnew', 'INSERT COIN TO CONTINUE', 32, 1).setOrigin(0.5,0.5);
        let instruct = this.add.bitmapText(this.width/2, this.height/2 + borderPadding/4, 'midnew', 'Press V or P to play again', 16, 1).setOrigin(0.5,0.5);

        var flash = this.tweens.add({
            targets: [over, coin, instruct],
            duration: 800,
            ease: 'Linear',
            repeat: -1,
            yoyo: true,
            scaleX: 1.1,
            scaleY: 1.1,
            alpha: 1,
        });

        this.tweenStarted = true;
    }

    lightingAnim() {
        this.light.setAlpha(0.5)
        this.tweens.add({
            targets: this.light,
            duration: 600,
            ease: 'Linear',
            repeat: 0,
            yoyo: true,
            alpha: 1,
        });
    }

    powAnim(x) {
        this.tweens.add({
            targets: x,
            duration: 600,
            ease: 'Linear',
            repeat: -1,
            yoyo: true,
            scale: { from: 2, to: 2.1 },
        });
    }

    formatValue(value) {
        return value.toString().padStart(14, '0');
    }

    tips() {
        let tip = this.add.bitmapText(this.width/2, this.height - borderPadding/2, 'midnew', 'Attack while speaking to deal more damage!', 14, 1).setOrigin(0.5,0.5);
        tip.setDepth(12);
        this.tweens.add({
            targets: tip,
            duration: 1800,
            ease: 'Linear',
            repeat: 0,
            yoyo: true,
            alpha: { from: 0, to: 1 },
        });
    }
}