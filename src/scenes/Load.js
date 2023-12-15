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
        this.load.bitmapFont('midnew', 'fonts/Backto1982.png', 'fonts/Backto1982.xml')
        this.load.bitmapFont('nums', 'fonts/Backto1982OG.png', 'fonts/Backto1982OG.xml')
        this.load.bitmapFont('bub', 'fonts/Librium.png', 'fonts/Librium.xml')

        // load sprites
        this.load.atlas('attacks', 'img/attackAnims.png', 'json/attackAnims.json')
        this.load.atlas('attacksF', 'img/attackAnimsFlip.png', 'json/attackAnimsFlip.json')
        this.load.atlas('characters', 'img/characterAnims.png', 'json/characterAnims.json')
        
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
        this.load.audio("RMspeak", "sounds/RMspeak.mp3"); // from QuickSounds
        this.load.audio("DKspeak", "sounds/DKspeak.mp3"); // from QuickSounds
        this.load.audio("hurt", "sounds/hurt.wav");
        this.load.audio("menuSelect", "sounds/pickupCoin.wav");
        this.load.audio("shoot", "sounds/attack.wav");
        this.load.audio("Drpow", "sounds/DRpow.wav");
        this.load.audio("Rumblepow", "sounds/RMpow.wav");
        this.load.audio("music", "sounds/cyborg-ninja-kevin-macleod.mp3");

        // load power up
        this.load.image("Pup", "img/PowerUpP.png");
        this.load.image("Vup", "img/PowerUpV.png");

    }

    create() {
        // Rumble Anims
        this.anims.create({
            key: "RM-duck-left",
            frames: [{key:'characters', frame:'RMduck-left'}],
            frameRate: 5,
            repeat: 2
        })

        this.anims.create({
            key: "RM-duck-right",
            frames: [{key:'characters', frame: 'RMduck-right'}],
            frameRate: 5,
            repeat: 2
        })

        this.anims.create({
            key: "RM-idle-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'RMidle',
                start: 1,
                end: 3,
            }),
            yoyo: true,
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "RM-idle-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'RMidleF',
                start: 1,
                end: 3,
            }),
            yoyo: true,
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "RM-nAttack-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'RMnattack',
                start: 1,
                end: 4,
            }),
            yoyo: true,
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "RM-nAttack-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'RMnattackF',
                start: 1,
                end: 4,
            }),
            yoyo: true,
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "RM-pow-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'RMpow',
                start: 1,
                end: 4,
            }),
            yoyo: true,
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "RM-pow-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'RMpowF',
                start: 1,
                end: 4,
            }),
            yoyo: true,
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "RM-run-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'RMrun',
                start: 1,
                end: 5,
            }),
            frameRate: 7,
            repeat: -1
        })

        this.anims.create({
            key: "RM-run-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'RMrunF',
                start: 1,
                end: 5,
            }),
            frameRate: 7,
            repeat: -1
        })

        let jump = this.anims.generateFrameNames('characters', {
            prefix: 'RMjump',
            start: 1,
            end: 4,
        })

        jump.push({key:'characters', frame:'RMjump4'})

        this.anims.create({
            key: "RM-jump-right",
            frames: jump,
            yoyo: true,
            frameRate: 5 ,
            repeat: 0
        })

        let jumpL = this.anims.generateFrameNames('characters', {
            prefix: 'RMjumpF',
            start: 1,
            end: 4,
        })

        jumpL.push({key:'characters', frame:'RMjumpF4'})

        this.anims.create({
            key: "RM-jump-left",
            frames: jumpL,
            yoyo: true,
            frameRate: 5,
            repeat: 0
        })

        // second attack
        let sAttack = this.anims.generateFrameNames('characters', {
            prefix: 'RMnattack',
            start: 1,
            end: 3,
        })
        sAttack.push({key:'characters', frame:'RMsattack'})
        sAttack.push({key:'characters', frame:'RMsattack'})

        this.anims.create({
            key: "RM-sAttack-right",
            frames: sAttack,
            frameRate: 10,
            yoyo: true,
            repeat: 0
        })

        let sAttackF = this.anims.generateFrameNames('characters', {
            prefix: 'RMnattackF',
            start: 1,
            end: 3,
        })
        sAttack.push({key:'characters', frame:'RMsattackF'})
        sAttack.push({key:'characters', frame:'RMsattackF'})

        this.anims.create({
            key: "RM-sAttack-left",
            frames: sAttackF,
            frameRate: 10,
            repeat: 0
        })

        // DR anims
        this.anims.create({
            key: "DK-duck-left",
            frames: [{key:'characters', frame:'DKduck-left'}],
            frameRate: 5,
            repeat: 2
        })

        this.anims.create({
            key: "DK-duck-right",
            frames: [{key:'characters', frame: 'DKduck-right'}],
            frameRate: 5,
            repeat: 2
        })

        this.anims.create({
            key: "DK-idle-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKidle',
                start: 1,
                end: 3,
            }),
            yoyo: true,
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "DK-idle-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKidleF',
                start: 1,
                end: 3,
            }),
            yoyo: true,
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "DK-nAttack-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKnattack',
                start: 1,
                end: 2,
            }),
            yoyo: true,
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "DK-nAttack-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKnattackF',
                start: 1,
                end: 2,
            }),
            yoyo: true,
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "DK-sAttack-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKsattack',
                start: 1,
                end: 3,
            }),
            yoyo: true,
            frameRate: 4.5,
            repeat: 0
        })

        this.anims.create({
            key: "DK-sAttack-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKsattackF',
                start: 1,
                end: 3
            }),
            yoyo: true,
            frameRate: 4.5,
            repeat: 0
        })

        this.anims.create({
            key: "DK-pow-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKpow',
                start: 1,
                end: 4,
            }),
            yoyo: true,
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "DK-pow-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKpowF',
                start: 1,
                end: 4,
            }),
            yoyo: true,
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "DK-run-left",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKrun',
                start: 1,
                end: 5,
            }),
            frameRate: 7,
            repeat: -1
        })

        this.anims.create({
            key: "DK-run-right",
            frames: this.anims.generateFrameNames('characters', {
                prefix: 'DKrunF',
                start: 1,
                end: 5,
            }),
            frameRate: 7,
            repeat: -1
        })

        let Djump = this.anims.generateFrameNames('characters', {
            prefix: 'DKjump',
            start: 1,
            end: 4,
        })

        Djump.push({key:'characters', frame:'DKjump4'})

        this.anims.create({
            key: "DK-jump-left",
            frames: Djump,
            yoyo: true,
            frameRate: 5 ,
            repeat: 0
        })

        let DjumpL = this.anims.generateFrameNames('characters', {
            prefix: 'DKjumpF',
            start: 1,
            end: 4,
        })

        DjumpL.push({key:'characters', frame:'DKjumpF4'})

        this.anims.create({
            key: "DK-jump-right",
            frames: DjumpL,
            yoyo: true,
            frameRate: 5,
            repeat: 0
        })

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

        this.scene.start("menuScene");
    }
}