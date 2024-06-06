// Global variable to only call the player animation once
loadAnim = false;

class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load Enemy
        this.load.atlas("evil_wizard", "evil_wizard.png", "evil_wizard.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "catacombs_tilemap.png");
        this.load.tilemapTiledJSON("dungeon_map", "dungeon_map.tmj");
        this.load.tilemapTiledJSON("dungeon", "dungeon.tmj");
    }

    create() {
        // Create the animation for the evil wizard
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('evil_wizard', {
                prefix: "idle_0",
                start: 1,
                end: 8,
                suffix: ".png",
                zeroPad: 1 // Adjust based on your frame naming
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('evil_wizard', {
                prefix: "run_0",
                start: 1,
                end: 8,
                suffix: ".png",
                zeroPad: 1 // Adjust based on your frame naming
            }),
            frameRate: 15,
            repeat: -1
        });


        this.scene.start("titleScreenScene");
    }
}