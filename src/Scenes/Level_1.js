class Level_1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    preload() {
        // Load necessary assets here
        this.load.atlasXML('player', 'assets/player.png', 'assets/player.xml');
    }

    create() {
        // Create a new tilemap which uses 16x16 tiles, and is 40 tiles wide and 25 tiles tall
        this.map = this.add.tilemap("dungeon_map", 30, 20, 16, 16);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("catacombs_tilemap", "tilemap_tiles");

        // Create the layers
        this.groundLayer = this.map.createLayer("groundLayer", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("wallLayer", this.tileset, 0, 0);
        // Fade in camera
        this.cameras.main.fadeIn(500, 0, 0, 0);
        // Enable collision for the wallLayer
        this.wallLayer.setCollisionByExclusion([-1]);

        // Set the bounds of the world to match the map dimensions
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.player = this.physics.add.sprite(100, 100, 'player');
        // this.physics.world.enable(this.player);
        this.player.setCollideWorldBounds(true); // Ensure player does not go out of bounds
        this.playerControl = new PlayerControl(this, this.player);
        // Camera control
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(4.0);


        // this.wallLayer.setCollisionByProperty({collides: true});
        this.physics.add.collider(this.player, this.wallLayer);
        this.sceneTransition = new SceneTransition(this, "Scene1->2", "DungeonScene", this.player);
        
        // Initialize enemy
        this.evil_wizard = new Enemy(this, 0, 0, "evil_wizard");
        //this.evil_wizard_2 = new Enemy(this, this.map.width, this.map.height, "evil_wizard");
        console.log(this.evil_wizard);
        console.log(this.player);

        // Debug graphics for collision boxes
        this.debugGraphics = this.add.graphics();
        this.debugActive = false; // Track debug mode status

        // Player and Enemy Collider
        this.physics.add.collider(this.player, this.evil_wizard);
        this.physics.add.overlap(this.player, this.evil_wizard, this.playerEnemyCollision, null, this);

        // Add key listener for toggling debug mode
        this.input.keyboard.on('keydown-Y', this.toggleDebug, this);
    }    

    toggleDebug() {
        this.debugActive = !this.debugActive;
        if (this.debugActive) {
            console.log("debugging on");
            this.drawDebug();
        } else {
            console.log("debugging off");
            this.debugGraphics.clear();
        }
    }

    drawDebug() {
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(1, 0xff0000, 1); // Red color for collision boxes
        this.wallLayer.renderDebug(this.debugGraphics, {
            tileColor: null, // No color for tiles
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 30), // Red color for colliding tiles
            faceColor: new Phaser.Display.Color(0, 255, 0, 255) // Green color for face edges
        });
    }

    playerEnemyCollision(player, enemy) {
        console.log("Dead");
        this.scene.restart();
    }

    update() {
        this.evil_wizard.update();
        this.playerControl.update();
    }
}