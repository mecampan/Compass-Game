// Global variable to only call the player animation once
loadAnim = false;

class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load Enemy
        this.load.image("evil_wizard", "evil_wizard_single.png")

        // Load tilemap information
        this.load.image("tilemap_tiles", "catacombs_tilemap.png");                   // Packed tilemap
        this.load.tilemapTiledJSON("dungeon_map", "dungeon_map.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("dungeon", "dungeon.tmj");
    }

    create() {
        this.scene.start("titleScreenScene");
    }
}