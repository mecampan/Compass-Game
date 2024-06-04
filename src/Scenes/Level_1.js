class Level_1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    preload() {
        // Load necessary assets here
    }

    create() {
        // Create a new tilemap which uses 16x16 tiles, and is 40 tiles wide and 25 tiles tall
        this.map = this.add.tilemap("dungeon_map", 30, 20, 16, 16);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("catacombs_tilemap", "tilemap_tiles");

        // Create the layers
        this.groundLayer = this.map.createLayer("groundLayer", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("wallLayer", this.tileset, 0, 0);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(2.0);

        this.player = this.physics.add.sprite(100, 100, 'character');
        this.player.play('idle');
        // Initialize enemy
        this.evil_wizard = new Enemy(this, 0, 0, "evil_wizard");
        //this.evil_wizard_2 = new Enemy(this, this.map.width, this.map.height, "evil_wizard");
        console.log(this.evil_wizard);
    }    

    update() {
        this.evil_wizard.update();
    }
}