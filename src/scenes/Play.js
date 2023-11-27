class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // game settings
        const height = game.config.height;
        const width = game.config.width;

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
        this.Rumble = new RM(this, width/4, height - borderPadding, "", 0);
        this.Dr = new DK(this, 3*width/4, height - borderPadding, "", 0);

        // parse dialog from JSON file
        this.dialog = this.cache.json.get('dialog')

        // dialog variables
        this.dialogConvo = 0			// current "conversation"
        this.dialogLine = 0			    // current line of conversation
        this.dialogSpeaker = null		// current speaker
        this.dialogLastSpeaker = null	// last speaker
        this.dialogTyping = false		// flag to lock player input while text is "typing"
        this.dialogText = null			// the actual dialog text
        this.nextText = null			// player prompt text to continue typing
        
        this.dialogConvos = this.dialog.length
        this.dialogLines = null
        this.dialogWords = null

        // initialize dialog text objects (with no text)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)

    }

    update() {
        this.Rumble.state.step();
        this.Dr.state.step();
    }


    // type text function from Nathan Altice
    fightText() {
        this.dialogLines = this.dialog[this.dialogConvo].length
        this.dialogWords = this.dialog[this.dialogConvo][this.dialogLine]['dialog'].split(" ");

        // lock input while typing
        this.dialogTyping = true

        // clear text
        this.dialogText.text = ''
        this.nextText.text = ''
        

        if () {
            
        }
    }
}