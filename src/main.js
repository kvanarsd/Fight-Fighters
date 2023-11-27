/*
Katrina Vanarsdale

Game Name: Fight Fighters

Hours: Probably almost 30 but I forgot to keep track again
*/
let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    width: 800,
    height: 480,
    scene: [ Load, Menu, Play]
}

let game = new Phaser.Game(config)

// ui sizes 
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize * 3;

let keySPACE;