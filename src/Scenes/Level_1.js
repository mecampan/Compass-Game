class Level_1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    preload() {
        // Load necessary assets here
        //this.load.atlasXML('player', 'assets/player.png', 'assets/player.xml');
    }

    create() {
        // Create a new tilemap which uses 16x16 tiles, and is 40 tiles wide and 25 tiles tall
        this.map = this.add.tilemap("dungeon_map");
        this.collectedBooks = 0;
        this.allBooksCollected = false;
        this.books = [];

        // sfx Sounds
        this.itemPickUpsfx = this.sound.add('item_pickup_sfx');
        this.gameOversfx = this.sound.add('game_over_sfx');
        this.gameOverState = false;
        // Array to store playerDB positions
        this.playerDBPositions = [];
        this.currentDBIndex = 0; // Current destination index


        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("catacombs_tilemap", "tilemap_tiles");

        // Create the layers
        this.groundLayer = this.map.createLayer("groundLayer", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("wallLayer", this.tileset, 0, 0);

        // Layer that doesn't interact with light source
        this.frontLayer = this.map.createLayer("frontLayer", this.tileset, 0, 0).setDepth(5);
        
        // spawnLayer objects
        this.spawnLayer = this.map.getObjectLayer('spawnLayer');

        // Fade in camera
        this.cameras.main.fadeIn(500, 0, 0, 0);
        // Enable collision for the wallLayer
        this.wallLayer.setCollisionByExclusion([-1]);

        this.scene.launch('hudScene'); // Start the UI scene
        this.HUD = this.scene.get('hudScene');
        this.load = this.scene.get('loadScene');

        // Add collectable oil bottles:
        this.oilBottles = [];
        this.createOilBottles();

        // Set the bounds of the world to match the map dimensions
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.startPoint = this.spawnLayer.objects.find(obj => obj.name === "playerSpawn");
        this.player = this.physics.add.sprite(this.startPoint.x, this.startPoint.y, 'player');
        // this.physics.world.enable(this.player);
        this.player.setCollideWorldBounds(true); // Ensure player does not go out of bounds
        this.playerControl = new PlayerControl(this, this.player);
        // Create player FOV
        this.playerFOV = new FOV(this, this.player, (x, y) => this.isTileTransparent(x, y), true);

        // Camera control
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(4.0);

        //Create Collision Zone For Game End Condition:
        this.targetZone = this.add.zone(2725, 1955, 48, 32);
        this.physics.world.enable(this.targetZone);
        this.targetZone.body.setAllowGravity(false);
        this.targetZone.body.moves = false;

        this.physics.add.overlap(this.player, this.targetZone, this.playerInZone, null, this);

        // Collision detection for the oil:
        this.oilBottles.forEach(bottle => {
            this.physics.add.overlap(this.player, bottle, this.collectOil, null, this);
        });

        //this.wallLayer.setCollisionByProperty({collides: true});
        //this.frontLayer.setCollisionByProperty({collides: true});

        this.physics.add.collider(this.player, this.wallLayer);
        this.physics.add.collider(this.player, this.frontLayer);

        // Initialize enemies
        this.enemies = this.physics.add.group();
        this.spawnEnemies();

        // Player and Enemy Collider
        this.physics.add.overlap(this.player, this.enemies, this.playerEnemyCollision, null, this);

        this.createMinimap();
        this.spawnBooks(this.player);
        this.fogOfWar = new Array(this.map.height).fill(null).map(() => new Array(this.map.width).fill(true)); // Initialize fog of war

        // Debug graphics for collision boxes
        this.debugGraphics = this.add.graphics();
        this.debugActive = false; // Track debug mode status

        // Add key listener for toggling debug mode
        this.input.keyboard.on('keydown-Y', this.toggleDebug, this);
        this.input.keyboard.on('keydown-SPACE', this.stunEnemy, this);

        // Fetch playerDB positions from spawnLayer
        this.fetchPlayerDBPositions();
        // Keyboard input for teleportation
        this.input.keyboard.on('keydown-B', this.teleportPlayer, this);
    }

    update() {
        this.playerControl.update();
        this.updateMinimap();
        this.revealMinimap();

        if (this.playerFOV) {
            this.playerFOV.update(); // Adjust the radius as needed
        }

        // Update enemies
        this.enemies.getChildren().forEach(enemySprite => {
            const enemy = enemySprite.enemyInstance;
            if (enemy) {
                enemy.update();
            }
        });

        // Draw debug graphics if debug mode is active
        if (this.debugActive) {
            this.drawDebug();
        }

    }

    // Method to fetch playerDB positions
    fetchPlayerDBPositions() {
        this.spawnLayer.objects.forEach(obj => {
            if (obj.name.startsWith('playerDB')) {
                this.playerDBPositions.push({ x: obj.x, y: obj.y });
            }
        });
    }

    // Method to teleport player to the next playerDB position
    teleportPlayer() {
        // Check if there are playerDB positions
        if (this.playerDBPositions.length === 0) {
            console.error("No playerDB positions found.");
            return;
        }

        // Teleport player to the next position
        const nextPosition = this.playerDBPositions[this.currentDBIndex];
        this.player.setPosition(nextPosition.x, nextPosition.y);

        // Increment currentDBIndex and loop back to 0 if it exceeds the array length
        this.currentDBIndex = (this.currentDBIndex + 1) % this.playerDBPositions.length;
    }

    createMinimap() {
        const minimapWidth = 250; // Width of the minimap
        const minimapHeight = 250; // Height of the minimap
        const padding = 10; // Padding from the edges
        
        // Create the miniCam for the minimap
        this.miniCam = this.cameras.add(padding, padding, minimapWidth, minimapHeight);
        this.miniCam.setZoom(1);
        this.miniCam.setBackgroundColor(0x000000); // Black background for visibility
    
        // Draw a rectangle for the minimap background (optional, for visibility)
        this.minimapGraphics = this.add.graphics();
        this.minimapGraphics.setScrollFactor(0); // Ensure it stays in place
        this.minimapGraphics.fillStyle(0x000000, 0.5); // Black background with 50% opacity
        this.minimapGraphics.fillRect(0, 0, minimapWidth, minimapHeight);
    
        // Trigger an event to update the HUD with the minimap
        this.scene.get('hudScene').events.emit('createMinimap', this.minimapGraphics, minimapWidth, minimapHeight);
        minimapCreated = true;
    }
    

    spawnBooks(player) {
        if (this.allBooksCollected === false) {
            this.player = player;
            const bookSpawnPoints = {
                "spell_book1": ["bookA1", "bookA2", "bookA3", "bookA4"],
                "spell_book2": ["bookB1", "bookB2", "bookB3", "bookB4"],
                "spell_book3": ["bookB5", "bookB6", "bookB7", "bookB8", "bookB9", "bookB10", "bookB11"]
            };

            Object.keys(bookSpawnPoints).forEach(bookType => {
                const spawnPoints = bookSpawnPoints[bookType];
                const randomSpawnPointName = Phaser.Utils.Array.GetRandom(spawnPoints);
                const spawnPoint = this.map.findObject("spawnLayer", obj => obj.name === randomSpawnPointName);

                if (spawnPoint) {
                    const book = new Book(this, spawnPoint.x, spawnPoint.y, bookType);
                    this.books.push(book);
                    this.physics.add.overlap(this.player, book, this.collectBook, null, this);
                }
            });
        }
    }

    collectBook(player, book) {
        this.itemPickUpsfx.play();

        book.collect();
        this.collectedBooks++;
        this.books = this.books.filter(b => b !== book);
        this.minimapGraphics.clear();
        if (this.collectedBooks === 3) {
            console.log("All Books collected");
            this.allBooksCollected = true;
            this.spawnBooks(this.player);
        }
        this.updateMinimap();
        this.scene.get('hudScene').events.emit('updateHud', this.collectedBooks);
    }

    createOilBottles() {
        this.spawnLayer.objects.forEach(obj => {
            if (obj.name === 'oilSpawn') {
                const oilBottle = this.physics.add.sprite(obj.x, obj.y, 'oilBottle');
                this.oilBottles.push(oilBottle);
            }
        });
    }

    collectOil(player, oil) {
        oil.destroy();
        this.HUD.refilOil();
    }

    spawnEnemies() {
        this.spawnLayer.objects.forEach(obj => {
            if (obj.name === 'enemySpawn') {
                const enemy = new Enemy(this, obj.x, obj.y, 'evil_wizard', 'idle_01.png');
                this.enemies.add(enemy.sprite);
            }
        });
    }

    stunEnemy() {
        if (this.HUD.oilAmount >= 10) {
            this.HUD.useOilStun();
            this.playerFOV.stunEnemiesInFOV();

            const radius = 3 * this.map.tileWidth;
            let circle = this.add.graphics();

            for (let i = radius; i > 0; i--) {
                let alpha = i / radius;
                circle.fillStyle(0xffe64e, alpha);
                circle.fillCircle(this.player.x, this.player.y, i);
            }

            this.tweens.add({
                targets: circle,
                alpha: { from: 0.1, to: 0 },
                duration: 500,
                onComplete: () => {
                    circle.destroy();
                }
            });
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
            this.playerFOV.clearFOVOutline();
        }
    }

    drawDebug() {
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(1, 0xff0000, 1);
        this.wallLayer.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 30),
            faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        });

        this.debugGraphics.strokeRect(
            this.player.body.x,
            this.player.body.y,
            this.player.body.width,
            this.player.body.height
        );

        this.playerFOV.drawFOVOutline(this.debugGraphics);

        this.enemies.getChildren().forEach(enemy => {
            enemy.enemyInstance.renderDebug(this.debugGraphics);
        });
    }

    playerEnemyCollision(player, enemySprite) {
        const enemy = enemySprite.enemyInstance;
        if (enemy) {
            enemy.enemyAttack();
        }
    }

    isTileTransparent(x, y) {
        const tile = this.groundLayer.getTileAt(x, y);
        return tile && tile.index !== -1;
    }

    updateMinimap() {
        const minimapWidth = 250;
        const minimapHeight = 250;
        const scaleX = minimapWidth / this.map.widthInPixels;
        const scaleY = minimapHeight / this.map.heightInPixels;
    
        // Clear previous minimap graphics
        this.minimapGraphics.clear();
    
        // Set the camera viewport to match the minimap dimensions
        this.miniCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    
            // Draw the minimap
        this.map.layers.forEach(layer => {
            layer.data.forEach(row => {
                row.forEach(tile => {
                    if (tile.index !== -1 && !this.fogOfWar[tile.y][tile.x]) {
                        const color = layer.name === 'groundLayer' ? 0x888888 : 0xcccccc;
                        this.minimapGraphics.fillStyle(color, 1);
                        this.minimapGraphics.fillRect(tile.pixelX * scaleX, tile.pixelY * scaleY, scaleX * tile.width, scaleY * tile.height);
                    }
                });
            });
        });
    
        const playerMinimapScale = 2.5;
    
        this.minimapGraphics.fillStyle(0x00ff00, 1);
        this.minimapGraphics.fillRect(
            (this.player.x * scaleX) - ((scaleX * this.player.width * (playerMinimapScale - 1)) / 2),
            (this.player.y * scaleY) - ((scaleY * this.player.height * (playerMinimapScale - 1)) / 2),
            scaleX * this.player.width * playerMinimapScale,
            scaleY * this.player.height * playerMinimapScale
        );
    
        const bookMinimapScale = 1;
        this.books.forEach(book => {
            book.setOrigin(0.5);
            this.minimapGraphics.fillStyle(0x0000ff, 1);
            this.minimapGraphics.fillRect(
                (book.x * scaleX) - ((scaleX * book.width * (bookMinimapScale - 1)) / 2),
                (book.y * scaleY) - ((scaleY * book.height * (bookMinimapScale - 1)) / 2),
                scaleX * book.width * bookMinimapScale,
                scaleY * book.height * bookMinimapScale
            );
        });
    
        // Emit event to update the HUD with the new minimap graphics
        this.scene.get('hudScene').events.emit('updateMinimap', this.minimapGraphics);
    }
    

    revealMinimap() {
        const revealRadius = 10;
        const playerTileX = Math.floor(this.player.x / this.map.tileWidth);
        const playerTileY = Math.floor(this.player.y / this.map.tileHeight);
        for (let y = -revealRadius; y <= revealRadius; y++) {
            for (let x = -revealRadius; x <= revealRadius; x++) {
                const revealX = playerTileX + x;
                const revealY = playerTileY + y;
                if (revealX >= 0 && revealX < this.map.width && revealY >= 0 && revealY < this.map.height) {
                    this.fogOfWar[revealY][revealX] = false;
                }
            }
        }
    }

    playerInZone(player, zone) {
        console.log("Player is in the target zone!");
        if(this.allBooksCollected == true){
            this.scene.stop("hudScene")
            this.scene.start("gameWonScene");
        }
    }

    gameOver() {
        if(!this.gameOverState) {
            this.gameOverState = true
            this.fadeOutAudio(this.load.music);
            this.gameOversfx.play();
            this.time.delayedCall(1500, () => {
                this.scene.stop("hudScene")
                this.scene.start("gameOverScene");
            });
        }
    }

    fadeInAudio(audio, duration = 500) {
        audio.setVolume(0); // Start with volume 0
        this.tweens.add({
            targets: audio,
            volume: 1,
            duration: duration
        });
    }

    fadeOutAudio(audio, duration = 500) {
        this.tweens.add({
            targets: audio,
            volume: 0,
            duration: duration,
            onComplete: () => {
                audio.stop();
            }
        });
    }
}