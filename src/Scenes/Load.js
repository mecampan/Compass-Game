class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load Enemy
        this.load.image("evil_wizard", "evil_wizard_single.png")

        this.load.spritesheet('character', 'character.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // Load tilemap information
        this.load.image("tilemap_tiles", "catacombs_tilemap.png");                   // Packed tilemap
        this.load.tilemapTiledJSON("dungeon_map", "dungeon_map.tmj");   // Tilemap in JSON


    }

    create() {
        // ...and pass to the next Scene
        // this.anims.create({
        //     key: 'idle',         // Name of the animation
        //     frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 15 }),
        //     frameRate: 10,       // Frame rate (number of frames per second)
        //     repeat: -1           // Repeat indefinitely
        // });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.start("level1Scene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}
