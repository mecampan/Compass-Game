class Credits extends Phaser.Scene{
    constructor() {
        super("creditsScene");
    }

    create(){
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
    
        this.add.bitmapText(centerX, centerY - 100, 'myFont', 'Credits', 56).setOrigin(0.5);
    
        this.add.bitmapText(centerX, centerY + 50, 'myFont', 'Asset Packs: Szadi Art, Bagong Games, LuizMelo', 44).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 150, 'myFont', 'Game Designers: Micheal Campanile, Jacqueline Gracey', 44).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 250, 'myFont', 'Level Designer: Luan Ta', 44).setOrigin(0.5);

        let back = this.add.bitmapText(centerX, centerY + 400, 'myFont', 'Back', 32).setOrigin(0.5).setInteractive({ useHandCursor: true });;

    
        back.on('pointerdown', () => {
            this.scene.stop("creditsScene");
            this.scene.start("titleScreenScene");
        });    
    
    }
    
    



}