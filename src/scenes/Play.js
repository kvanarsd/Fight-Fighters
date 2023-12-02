class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // game settings
        this.height = game.config.height;
        this.width = game.config.width;

        // background
        const background = this.add.image(0,0,"bckg", 0).setOrigin(0,0).setScale(0.75);
        const rocks = this.add.image(0,0,"rocks", 0).setOrigin(0,0).setScale(0.75);
        const outline = this.add.image(0,0,"outer", 0).setOrigin(0,0).setScale(0.75);
        this.light = this.add.image(0,0,"light", 0).setOrigin(0,0).setScale(0.75);

        rocks.setDepth(9)
        outline.setDepth(10)
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
        this.Rumble = new RM(this, this.width/4, this.height - borderPadding, "", 0);
        this.Dr = new DK(this, 3*this.width/4, this.height - borderPadding, "", 0);
        
        // ground collision
        const ground = this.add.rectangle(0, this.height - borderPadding/1.2 , this.width, 1).setOrigin(0,0)
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
        this.dialogConvos = this.dialog.length -1
        this.dialogLines = null         // amount of lines in convo
        this.dialogWords = null         // amount of words to iterate through

        // initialize dialog text objects (with no text)
        //this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)
        //this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)

        // random timer for starting convos
        this.convoTimer = this.time.addEvent({
            delay: 200,
            callback: this.convoStarter,
            callbackScope: this,
            loop: true
        });

        //this.add.bitmapText(centerX, centerY, 'midnew', this.word).setOrigin(0.5)


        // attacks out of bounds
        this.RmiddleBound = new Phaser.Geom.Rectangle(0, 0, this.width/2 - borderPadding, this.height);
        this.DmiddleBound = new Phaser.Geom.Rectangle(this.width/2 + borderPadding, 0, this.width/2 - borderPadding, this.height);
 
        this.Rumble.body.setBoundsRectangle(this.RmiddleBound)
        this.Dr.body.setBoundsRectangle(this.DmiddleBound)

    }

    update() {
        this.Rumble.state.step();
        this.Dr.state.step();

        // lighting
        if(this.light.alpha >= 0.5 && this.lightDim) {
            const addLight = this.light.alpha - 0.01
            this.light.setAlpha(addLight)
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
            
            this.light.setAlpha(1)
            console.log("speak")
            this.Rumble.spoken = true;
            const talk = new Attack(this, this.Rumble.x, this.Rumble.y, '', 0, this.Rumble, this.Rumble.direction, this.Dr, this.dialogWords[this.dialogWord])
            this.dialogWord++;
        }

        if(this.Dr.attacking && this.dialogTalking && this.dialogSpeaker == "DK" && !this.Dr.spoken) {
            this.light.setAlpha(1)
            console.log("speak")
            this.Dr.spoken = true;
            const talk = new Attack(this, this.Dr.x, this.Dr.y, '', 0, this.Dr, this.Dr.direction, this.Rumble, this.dialogWords[this.dialogWord])
            this.dialogWord++;
        }

        // end convo if speaker is hurt
        if(this.dialogSpeaker == "RM" && this.Rumble.hurt) {
            this.dialogTalking = false;
            this.convoTimer.paused = false;
        }
    }

    convoStarter() {
        this.convoTimer.delay = Phaser.Math.Between(200, 1000);
        this.convoTimer.paused = true;

        this.dialogConvo = Phaser.Math.Between(0, this.dialogConvos);
        this.dialogTalking = true;
        this.dialogLines = this.dialog[this.dialogConvo].length
        this.dialogLine = 0;
        this.dialogWord = 0;
        this.dialogWords = this.dialog[this.dialogConvo][this.dialogLine]['dialog'].split(" ");
        this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker']
        console.log(this.dialogWords)
        console.log(this.dialogWords[this.dialogWord])

    }

    convo() {
        

        // lock input while typing
        this.dialogTyping = true

        // clear text
        this.dialogText.text = ''
        this.nextText.text = ''
    }
}