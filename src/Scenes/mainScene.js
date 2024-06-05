class mainDungeon extends Phaser.Scene {
    constructor() {
        super("DungeonScene");
    }

    create() {
        // Create a new tilemap which uses 16x16 tiles, and is 40 tiles wide and 25 tiles tall
        this.map = this.add.tilemap("dungeon", 62, 52, 16, 16);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("catacombs_tilemap", "tilemap_tiles");

        // Create the layers
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);

        // Fade in the scene
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Set the bounds of the world to match the map dimensions
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Add the player to the scene
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true); // Ensure player does not go out of bounds

        // Create player control
        this.playerControl = new PlayerControl(this, this.player);

        // Camera control
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(4.0);

        this.sceneTransition = new SceneTransition(this, "Scene2->1", "level1Scene", this.player);
    }



    update() {
        this.playerControl.update();
    }
}
