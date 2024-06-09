class mainDungeon extends Phaser.Scene {
    constructor() {
        super("DungeonScene");
    }

    create() {
        // Create a new tilemap which uses 16x16 tiles, and is 40 tiles wide and 25 tiles tall
        this.map = this.add.tilemap("dungeon");

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("catacombs_tilemap", "tilemap_tiles");

        // Create the layers
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
        this.wallLayer.setCollisionByProperty({collides: true});

        // Fade in the scene
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Set the bounds of the world to match the map dimensions
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Add the player to the scene
        const playerSpawn = this.map.findObject("spawnsLayer", obj => obj.name === "PlayerSpawn1");
        this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, "player");

        //this.player = this.physics.add.sprite(3213, 1989, 'player');
        this.player.setCollideWorldBounds(true); // Ensure player does not go out of bounds
        this.physics.add.collider(this.player, this.wallLayer);

        // Create player control
        this.playerControl = new PlayerControl(this, this.player);
        //this.playerFOV = new FOV(this, this.player, (x, y) => this.isTileTransparent(x, y), true);
       
        // Camera control
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(3.0);

        this.sceneTransition = new SceneTransition(this, "Scene2->1", "level1Scene", this.player);

        // Generate the maze (unfinished, do not touch)
        // this.createMaze(this.wallLayer, this.tileset);

        // Debug graphics for collision boxes
        this.debugGraphics = this.add.graphics();
        this.debugActive = false; // Track debug mode status
        // Add key listener for toggling debug mode
        this.input.keyboard.on('keydown-Y', this.toggleDebug, this);

        // Add key listener for teleporting player (checking maze)
        // this.input.keyboard.on('keydown-B', () => this.DBTeleport(this.player, "PlayerDBSpawn"), this);

    }


    // This function is unfinished, it currently isn't working.
    // createMaze(wallLayer, tilePic) {
    //     const mazeWidth = 66;
    //     const mazeHeight = 42;
    //     const startX = 105;
    //     const startY = -104;
    //     const endX = 168;
    //     const endY = -62;
    //     const wallTileID = 607;
    //     const layer = wallLayer;
    //     const tileset = tilePic;

    //     // console.log(`Creating maze from (${startX}, ${startY}) to (${endX}, ${endY})`);
        
    //     const mazeGenerator = new MazeGenerator(mazeWidth, mazeHeight, startX, startY, endX, endY, wallTileID, this.map, layer, tileset);
    //     mazeGenerator.applyMaze();
    // }

    //debug function to check maze
    DBTeleport(player, spawnName) {
        const playerDBSpawn = this.map.findObject("spawnsLayer", obj => obj.name === spawnName);
        if (playerDBSpawn) {
            player.setPosition(playerDBSpawn.x, playerDBSpawn.y);
            console.log(`Player teleported to ${playerDBSpawn.x}, ${playerDBSpawn.y}`);
        } else {
            console.log(`Spawn point "${spawnName}" not found`);
        }
    }

    toggleDebug() {
        this.debugActive = !this.debugActive;
        if (this.debugActive) {
            console.log("debugging on");
            console.log(this.player.x, this.player.y);
            this.drawDebug();
        } else {
            console.log("debugging off");
            this.debugGraphics.clear();
            //this.playerFOV.clearFOVOutline();
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

        this.debugGraphics.strokeRect(
            this.player.body.x,
            this.player.body.y,
            this.player.body.width,
            this.player.body.height
        );

        //this.playerFOV.drawFOVOutline(this.debugGraphics);

        // Draw debug for each enemy in the group
        // this.enemies.getChildren().forEach(enemy => {
        //     enemy.enemyInstance.renderDebug(this.debugGraphics);
        // });
    }

    update() {
        this.playerControl.update();

        // Draw debug graphics if debug mode is active
        if (this.debugActive) {
            this.drawDebug();
        }
    }
}
