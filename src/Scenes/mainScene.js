class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }

    init() {
        this.collectedBooks = 0;
        this.allBooksCollected = false;
        this.books = [];
        this.bookGlows = new Map(); // Map to store references to book glows

        // Array to store playerDB positions
        this.playerDBPositions = [];
        this.currentDBIndex = 0; // Current destination index

        this.gameOverState = false;
    }

    preload() {
        // Load necessary assets here
        //this.load.atlasXML('player', 'assets/player.png', 'assets/player.xml');
    }

    create() {
        // Create a new tilemap which uses 16x16 tiles, and is 40 tiles wide and 25 tiles tall
        this.map = this.add.tilemap("dungeon_map");

        // sfx Sounds
        this.itemPickUpsfx = this.sound.add('item_pickup_sfx');
        this.walkSound = this.sound.add('walk_sfx');

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("catacombs_tilemap", "tilemap_tiles");
        // Create the layers
        this.groundLayer = this.map.createLayer("groundLayer", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("wallLayer", this.tileset, 0, 0);

        // spawnLayer objects
        this.spawnLayer = this.map.getObjectLayer('spawnLayer');

        this.scene.launch('hudScene'); // Start the UI scene
        this.HUD = this.scene.get('hudScene');

        // Set the bounds of the world to match the map dimensions
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.startPoint = this.spawnLayer.objects.find(obj => obj.name === "playerSpawn");
        this.player = this.physics.add.sprite(this.startPoint.x, this.startPoint.y, 'player');
        this.player.setCollideWorldBounds(true); // Ensure player does not go out of bounds
        this.playerControl = new PlayerControl(this, this.player);

        // Camera control
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(4.0);

        //Create Collision Zone For Game End Condition:
        this.targetZone = this.add.zone(2725, 1985, 48, 32);
        this.physics.world.enable(this.targetZone);
        this.targetZone.body.setAllowGravity(false);
        this.targetZone.body.moves = false;

        this.physics.add.overlap(this.player, this.targetZone, this.playerInZone, null, this);
        this.wallLayer.setCollisionByProperty({collides: true});
        this.physics.add.collider(this.player, this.wallLayer);
    }

    update() {
        this.playerControl.update();
    }
}