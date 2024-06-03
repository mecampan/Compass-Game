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
    }

    create() {
        // ...and pass to the next Scene
        this.scene.start("level1Scene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}
