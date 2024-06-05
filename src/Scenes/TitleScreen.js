class TitleScreen extends Phaser.Scene{
    constructor() {
        super("titleScreenScene");
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
    
        let title = this.add.text(centerX, centerY - 50, 'Exorcism Dungeon', {
            fontFamily: 'IM Fell English SC', 
            fontSize: '56px'
        }).setOrigin(0.5);
    
        let play = this.add.text(centerX, centerY + 120, 'Play', {
            fontFamily: 'IM Fell English SC',
            fontSize: '32px', 
            fill: '#fff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        let credits = this.add.text(centerX, centerY + 50, 'Credits', {
            fontFamily: 'IM Fell English SC',
            fontSize: '32px', 
            fill: '#fff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
        // add credits scene
    
        play.on('pointerdown', () => {
            this.scene.stop("titleScreenScene");
            this.scene.start("level1Scene");
        });    
    
        // Adding a tween for the text elements
        this.tweens.add({
            targets: [play],
            scaleX: 1.2,
            scaleY: 1.2,
            ease: 'Sine.easeInOut', // Smooth sinusoidal easing
            duration: 1000, // Duration of one-way scaling
            yoyo: true, // Apply the tween back to the original state
            repeat: -1 // Repeat infinitely
        });
    }
    
    



}