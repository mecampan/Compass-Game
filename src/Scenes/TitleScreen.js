class TitleScreen extends Phaser.Scene{
    constructor() {
        super("titleScreenScene");
    }

    create(){
        let sound = this.sound.add('ui_sound');
        // Load the tilemap and tileset
        this.map = this.add.tilemap("dungeon", 62, 52, 16, 16);
        this.tileset = this.map.addTilesetImage("catacombs_tilemap", "tilemap_tiles");
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
    
        // Calculate scale factors to fit the screen
        const scaleX = this.sys.game.config.width / this.groundLayer.width;
        const scaleY = this.sys.game.config.height / this.groundLayer.height;
    
        // Scale the layer
        this.groundLayer.setScale(scaleX, scaleY);
    
        // Fade in the scene
        this.cameras.main.fadeIn(500, 0, 0, 0);
    
        // Set the bounds of the world to match the scaled map dimensions
        this.physics.world.setBounds(0, 0, this.map.widthInPixels * scaleX, this.map.heightInPixels * scaleY);
    
        // Centering text based on the game's configuration
        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;
    
        let title = this.add.bitmapText(centerX, centerY - 50, 'myFont', 'Exorcism Dungeon', 56).setOrigin(0.5);
    
        // For the 'Play' button
        let play = this.add.bitmapText(centerX, centerY + 120, 'myFont', 'Play', 32)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => play.setScale(1.2))
            .on('pointerout', () => play.setScale(1))
            .on('pointerdown', () => {
                sound.play();
                this.scene.stop("titleScreenScene");
                this.scene.start("level1Scene");
            });

        // For the 'Credits' button
        let credits = this.add.bitmapText(centerX, centerY + 50, 'myFont', 'Credits', 32)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => credits.setScale(1.2))
            .on('pointerout', () => credits.setScale(1))
            .on('pointerdown', () => {
                sound.play();
                this.scene.start('creditsScene');  // Example scene change
            });
    }
    
    



}