// Jacqueline Gracey, jgracey@ucsc.edu
// Luan Ta, luta@ucsc.edu 
// Michael Campanile, mecampan@uscc.edu
// Created: 5/29/2024
// Phaser: 3.70.0
//
// Art assets provided by: https://szadiart.itch.io/rogue-fantasy-catacombs
//
// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    scale: {
        mode: Phaser.Scale.FIT, // Fit to window
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game canvas in the window
        width: 1900,
        height: 900
    },
    physics: {
        default: 'arcade',
        arcade: {
            tileBias: 24,
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Load, TitleScreen, Credits, HowToPlay, Level_1, mainDungeon, HUD]
}

var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {}, vfx: {} };

const game = new Phaser.Game(config);