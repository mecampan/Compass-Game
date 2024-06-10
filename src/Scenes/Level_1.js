class Level_1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
        this.collectedBooks = 0;
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
        // Layer that doesn't interact with light source
        this.frontLayer = this.map.createLayer("frontLayer", this.tileset, 0, 0); 
        this.spawnLayer = this.map.getObjectLayer('spawnLayer');

        // Fade in camera
        this.cameras.main.fadeIn(500, 0, 0, 0);
        // Enable collision for the wallLayer
        this.wallLayer.setCollisionByExclusion([-1]);

        this.scene.launch('hudScene'); // Start the UI scene
        this.HUD = this.scene.get('hudScene');

        // Add collectable books:
        this.books = [
            new Book(this, 50, 100, 'spell_book1'),
            new Book(this, 150, 100, 'spell_book2'),
            new Book(this, 250, 100, 'spell_book3')
        ];

        // Add collectable oil bottles:
        this.oilBottles = [
            this.physics.add.sprite(100, 50, 'oilBottle')
        ];

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

        // Collision detection for the books:
        this.books.forEach(book => {
            this.physics.add.overlap(this.player, book, this.collectBook, null, this);
        });

        // Collision detection for the oil:
        this.oilBottles.forEach(bottle => {
            this.physics.add.overlap(this.player, bottle, this.collectOil, null, this);
        });

        // this.wallLayer.setCollisionByProperty({collides: true});
        this.physics.add.collider(this.player, this.wallLayer);
        this.sceneTransition = new SceneTransition(this, "Scene1->2", "DungeonScene", this.player);

        // Initialize enemies
        this.enemies = this.physics.add.group();

        // Create enemies and add them to the group
        this.enemyStartPoint1 = this.spawnLayer.objects.find(obj => obj.name === "enemySpawn1");
        this.enemyStartPoint2 = this.spawnLayer.objects.find(obj => obj.name === "enemySpawn2");
        this.enemyStartPoint3 = this.spawnLayer.objects.find(obj => obj.name === "enemySpawn3");

        const enemy1 = new Enemy(this, this.enemyStartPoint1.x, this.enemyStartPoint1.y, 'evil_wizard', 'idle_01.png');
        const enemy2 = new Enemy(this, this.enemyStartPoint1.x, this.enemyStartPoint1.y, 'evil_wizard', 'idle_01.png');
        const enemy3 = new Enemy(this, this.enemyStartPoint1.x, this.enemyStartPoint1.y, 'evil_wizard', 'idle_01.png');


        this.enemies.add(enemy1.sprite);
        //this.enemies.add(enemy2.sprite);   

        // Player and Enemy Collider
        this.physics.add.overlap(this.player, this.enemies, this.playerEnemyCollision, null, this);

        // Debug graphics for collision boxes
        this.debugGraphics = this.add.graphics();
        this.debugActive = false; // Track debug mode status

        // Add key listener for toggling debug mode
        this.input.keyboard.on('keydown-Y', this.toggleDebug, this);
        this.input.keyboard.on('keydown-SPACE', this.stunEnemy, this);
    }

    update() {
        this.playerControl.update();
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

    collectBook(player, book) {
        this.collectedBooks++;
        book.collect();
        if (this.collectedBooks === 3) {
            this.triggerEvent();
        }

        // Update the UI scene with the collected book count
        this.scene.get('hudScene').events.emit('updateHud', this.collectedBooks);
    }

    collectOil(player, oil) {
        oil.destroy();
        this.HUD.refilOil();
    }

    stunEnemy() {
        this.HUD.useOilStun();
        this.playerFOV.stunEnemiesInFOV();

        const radius = 3 * this.map.tileWidth; // Circle radius in pixels
        let circle = this.add.graphics();

        // Draw the gradient circle
        for (let i = radius; i > 0; i--) {
            let alpha = i / radius;
            circle.fillStyle(0xffe64e, alpha);
            circle.fillCircle(this.player.x, this.player.y, i);
        }

        this.tweens.add({
            targets: circle,
            alpha: { from: 0.1, to: 0 },
            duration: 500, // Duration of the flash effect in milliseconds
            onComplete: () => {
                circle.destroy();
            }
        });
    }

    // GAME FINISHED EVENT to be triggered:
    triggerEvent() {
        console.log('All books collected!');
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

        this.playerFOV.drawFOVOutline(this.debugGraphics);

        // Draw debug for each enemy in the group
        this.enemies.getChildren().forEach(enemy => {
            enemy.enemyInstance.renderDebug(this.debugGraphics);
        });
    }

    playerEnemyCollision(player, enemySprite) {
        const enemy = enemySprite.enemyInstance; // Access the Enemy instance
        if (enemy) {
            enemy.enemyAttack();
        }
    }

    isTileTransparent(x, y) {
        const tile = this.groundLayer.getTileAt(x, y);
        return tile && tile.index !== -1; // Example condition, adjust as needed
    }
}