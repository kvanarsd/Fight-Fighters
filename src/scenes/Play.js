class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // game settings
        this.height = game.config.height;
        this.width = game.config.width;

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
        this.rightBound = this.add.rectangle(this.width/2, this.height/2, 100, 100);
        this.rightBound.alpha = 0;
        this.RmiddleBound = new Phaser.Geom.Rectangle(0, 0, this.width/2 - borderPadding, this.height);
        this.DmiddleBound = new Phaser.Geom.Rectangle(this.width/2 + borderPadding, 0, this.width/2 - borderPadding, this.height);
 
        this.Rumble.body.setBoundsRectangle(this.RmiddleBound)
        this.Dr.body.setBoundsRectangle(this.DmiddleBound)

    }

    update() {
        this.Rumble.state.step();
        this.Dr.state.step();

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
            this.Rumble.spoken = true;
            // do something with this - this.dialogWords[this.dialogWord]
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
        this.at = new Attack(this, game.config.width/2, game.config.height/2, '', 0, this.Rumble, this.Rumble.direction, this.Dr, this.dialogWords[this.dialogWord])
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