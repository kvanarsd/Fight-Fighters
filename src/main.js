/*
Katrina Vanarsdale

Game Name: Fight Fighters

Hours: Probably almost 30 but I forgot to keep track again
*/
let config = {
    parent: "gameView",
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    width: 750,
    height: 609,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.HORIZONTALLY
    },
    scene: [ Load, Menu, Play]
}

let game = new Phaser.Game(config)

// ui sizes 
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize * 3;

let keySPACE;