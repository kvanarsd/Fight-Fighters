/*
Katrina Vanarsdale

Game Name: Fight Fighters

Components: physics system, text objects (bitmap text), animation manager, tween manager, timers, and idk if this counts but state machines as well.

Polish/Style: I converted the fighter game into something more managable while creating more interactings with the characters. Turning the attacks into a conversation allows the players to get to know the characters and also implement the cut scenes that the show has.
I wanted the game to feel like an arcade game so I created a border and lighting effect. I also spent a lot of time on the art getting it to have a similar look to the original game. I'm no animator so creating the animations for the characters and their attacks took a lot of time. My goal was to make all movement and tweens smooth and add to the visual of the game without being distracting. 

Hours: ~35
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
            debug: false
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