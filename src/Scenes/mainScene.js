class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }

    init() {
        this.collectedBooks = 0;
        this.allBooksCollected = false;
        this.books = [];
        this.bookGlows = new Map(); // Map to store references to book glows
    }

    preload() {
    }

    create() {
        // sfx Sounds
        this.itemPickUpsfx = this.sound.add('item_pickup_sfx');
        this.walkSound = this.sound.add('walk_sfx');

        this.map = this.add.tilemap("dungeon_map");
        this.tileset = this.map.addTilesetImage("catacombs_tilemap", "tilemap_tiles");
        this.groundLayer = this.map.createLayer("groundLayer", this.tileset, 0, 0);
        this.collisionLayer = this.map.createLayer("collisionLayer", this.tileset, 0, 0);
        this.spawnLayer = this.map.getObjectLayer('spawnLayer');

        // Start the UI scene
        this.scene.launch('hudScene');
        this.HUD = this.scene.get('hudScene');

        // Set the bounds of the world to match the map dimensions
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.startPoint = this.spawnLayer.objects.find(obj => obj.name === "playerSpawn");
        this.player = this.physics.add.sprite(this.startPoint.x, this.startPoint.y, 'player');
        this.player.setCollideWorldBounds(true); // Ensure player does not go out of bounds
        this.playerControl = new PlayerControl(this, this.player);

        this.compassObjects = this.physics.add.group();
        this.createCompassObjects();

        // Set layer for details in front of player
        this.frontLayer = this.map.createLayer("frontLayer", this.tileset, 0, 0);

        // Camera control
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(4.0);

        // Set collisions
        this.collisionLayer.setCollisionByProperty({collides: true});
        this.physics.add.collider(this.player, this.collisionLayer);
    }

    createCompassObjects() {
        this.compassObjects.objects.forEach(obj => {
            if (obj.name === 'compassSpawn') {
                const compass = new Compass(this, obj.x, obj.y, 'evil_wizard', 'compass_image.png');
                this.compassObjects.add(compass.sprite);
            }
        });
    }


    update() {
        this.playerControl.update();
    }
}