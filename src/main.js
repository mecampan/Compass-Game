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
    width: 1440,
    height: 900,
    scene: [Load, TitleScreen, Level_1, mainDungeon]
}

var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {}, vfx: {} };

const game = new Phaser.Game(config);