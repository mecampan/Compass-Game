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
        // Fade in camera
        this.cameras.main.fadeIn(500, 0, 0, 0);
        // Enable collision for the wallLayer
        this.wallLayer.setCollisionByExclusion([-1]);

        // Add collectable books:
        this.books = [
            new Book(this, 50, 100, 'spell_book1').setScale(.3),
            new Book(this, 150, 100, 'spell_book2').setScale(.3),
            new Book(this, 250, 100, 'spell_book3').setScale(.3)
        ];

        // Set the bounds of the world to match the map dimensions
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.player = this.physics.add.sprite(100, 100, 'player');
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
        
        // this.wallLayer.setCollisionByProperty({collides: true});
        this.physics.add.collider(this.player, this.wallLayer);
        this.sceneTransition = new SceneTransition(this, "Scene1->2", "DungeonScene", this.player);

        // Initialize enemies
        this.enemies = this.physics.add.group();

        // Create enemies and add them to the group
        const enemy1 = new Enemy(this, 0, 0, 'evil_wizard', 'idle_01.png');
        //const enemy2 = new Enemy(this, 100, 100, 'evil_wizard', 'idle_01.png');
        this.enemies.add(enemy1.sprite);
        //this.enemies.add(enemy2.sprite);   

        // Player and Enemy Collider
        this.physics.add.overlap(this.player, this.enemies, this.playerEnemyCollision, null, this);    

        // Debug graphics for collision boxes
        this.debugGraphics = this.add.graphics();
        this.debugActive = false; // Track debug mode status

        // Add key listener for toggling debug mode
        this.input.keyboard.on('keydown-Y', this.toggleDebug, this);
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

    update() {
        this.playerControl.update();
        if(this.playerFOV) {
            this.playerFOV.updateFOV(5); // Adjust the radius as needed
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
    }

    // GAME FINISHED EVENT to be triggered:
    triggerEvent() {
        console.log('All books collected!');
    }

}