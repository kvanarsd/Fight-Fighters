/*
Katrina Vanarsdale

Game Name: Fight Fighters

Hours: 22 - 12/7/23
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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.HORIZONTALLY
    },
    scene: [ Load, Menu, Play]
}

let game = new Phaser.Game(config)

// ui sizes 
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize * 3;

let P, V;