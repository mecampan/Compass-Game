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
        this.cameras.main.setZoom(4.0);

        this.sceneTransition = new SceneTransition(this, "Scene2->1", "level1Scene", this.player);

        // Generate the maze (unfinished, do not touch)
        this.createMaze(this.map, this.wallLayer, this.tileset);
        //this.createMaze(this.map, this.groundLayer, this.tileset);

        // Debug graphics for collision boxes
        this.debugGraphics = this.add.graphics();
        this.debugActive = false; // Track debug mode status
        // Add key listener for toggling debug mode
        this.input.keyboard.on('keydown-Y', this.toggleDebug, this);

        // Add key listener for teleporting player (checking maze)
        this.input.keyboard.on('keydown-B', () => this.DBTeleport(this.player, "PlayerDBSpawn"), this);

        // Create minimap and fog of war
        this.createMinimap();
        // NOTE: comment out this line below to show full minimap (1/5)
        //this.fogOfWar = new Array(this.map.height).fill(null).map(() => new Array(this.map.width).fill(true)); // Initialize fog of war
    }


    //This function is unfinished, it currently isn't working.
    createMaze(map, wallLayer, tileset) {
        const mazeWidth = 66;
        const mazeHeight = 42;
        // const startX = 105;
        // const startY = -104;
        const endX = 170;
        const endY = -62;
        const startX = 104;
        const startY = 1;
        // const endX = 33;
        // const endY = 21;
        const wallTileID = 1234;
        //const wallTileID = 403;

        const mazeGenerator = new MazeGenerator(mazeWidth, mazeHeight, startX, startY, endX, endY, wallTileID, map, wallLayer, tileset);
        mazeGenerator.applyMaze();

        // Ensure the layer is visible
        wallLayer.setVisible(true);
    }



    createMinimap() {
        const minimapWidth = 250; // Width of the minimap
        const minimapHeight = 250; // Height of the minimap

        // Create a graphics object for the minimap
        this.minimapGraphics = this.add.graphics();
        this.minimapGraphics.setScrollFactor(0); // Ensure it stays in place

        // Trigger an event to update the HUD with the minimap
        this.scene.get('hudScene').events.emit('createMinimap', this.minimapGraphics, minimapWidth, minimapHeight);
    }

    //debug function to check maze
    DBTeleport(player, spawnName) {
        const playerDBSpawn = this.map.findObject("spawnsLayer", obj => obj.name === spawnName);
        if (playerDBSpawn) {
            player.setPosition(playerDBSpawn.x, playerDBSpawn.y);
            console.log(`Player teleported to ${playerDBSpawn.x}, ${playerDBSpawn.y}`);
        } else {
            console.log(`Spawn point "${spawnName}" not found`);
        }
        //this.player.setPosition(1500, 141);
        //this.player.setPosition(105, -104);
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

        this.updateMinimap();
        // NOTE: comment out this line below to show full minimap (2/5)
        //this.revealMinimap();
    }

    updateMinimap() {
        const minimapWidth = 250; // Width of the minimap
        const minimapHeight = 250; // Height of the minimap
        const scaleX = minimapWidth / this.map.widthInPixels;
        const scaleY = minimapHeight / this.map.heightInPixels;

        // Clear previous minimap graphics
        this.minimapGraphics.clear();

        // Draw the ground and walls layers onto the minimap based on fog of war
        this.map.layers.forEach(layer => {
            layer.data.forEach(row => {
                row.forEach(tile => {
                    // NOTE: uncomment out this line below to show full minimap (3/5)
                    if (tile.index !== -1) {
                    // NOTE: comment out this line below to show full minimap (4/5)
                    //if (tile.index !== -1 && !this.fogOfWar[tile.y][tile.x]) { // Only draw non-empty and revealed tiles
                        const color = layer.name === 'Ground' ? 0x888888 : 0xcccccc; // Differentiate wall and ground tiles
                        this.minimapGraphics.fillStyle(color, 1);
                        this.minimapGraphics.fillRect(tile.pixelX * scaleX, tile.pixelY * scaleY, scaleX * tile.width, scaleY * tile.height);
                    }
                });
            });
        });

        // Define a scale factor for the player on the minimap
        const playerMinimapScale = 2.5;

        // Draw the player onto the minimap
        this.minimapGraphics.fillStyle(0x00ff00, 1); // Green for the player
        this.minimapGraphics.fillRect(
            (this.player.x * scaleX) - ((scaleX * this.player.width * (playerMinimapScale - 1)) / 2), 
            (this.player.y * scaleY) - ((scaleY * this.player.height * (playerMinimapScale - 1)) / 2), 
            scaleX * this.player.width * playerMinimapScale, 
            scaleY * this.player.height * playerMinimapScale
        );
        // Trigger an event to update the HUD with the new minimap graphics
        this.scene.get('hudScene').events.emit('updateMinimap', this.minimapGraphics);
    }

    // NOTE: comment out this function below to show full minimap (5/5)
    revealMinimap() {
        const revealRadius = 5; // Radius around the player to reveal tiles
        const playerTileX = Math.floor(this.player.x / this.map.tileWidth);
        const playerTileY = Math.floor(this.player.y / this.map.tileHeight);

        for (let y = -revealRadius; y <= revealRadius; y++) {
            for (let x = -revealRadius; x <= revealRadius; x++) {
                const revealX = playerTileX + x;
                const revealY = playerTileY + y;
                if (revealX >= 0 && revealX < this.map.width && revealY >= 0 && revealY < this.map.height) {
                    this.fogOfWar[revealY][revealX] = false; // Reveal the tile
                }
            }
        }
    }
}
