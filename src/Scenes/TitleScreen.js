class TitleScreen extends Phaser.Scene{
    constructor() {
        super("titleScreenScene");
    }

    create(){
        let sound = this.sound.add('ui_sound');
    
        // Fade in the scene
        this.cameras.main.fadeIn(500, 0, 0, 0);
    
        // Set the bounds of the world to match the scaled map dimensions
        // this.physics.world.setBounds(0, 0, this.map.widthInPixels * scaleX, this.map.heightInPixels * scaleY);
    
        // Centering text based on the game's configuration
        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;
    
        let title = this.add.bitmapText(centerX, centerY - 100, 'myFont', 'Exorcism Dungeon', 56).setOrigin(0.5);
    
        // For the 'Play' button
        let play = this.add.bitmapText(centerX, centerY + 50, 'myFont', 'Play', 64)
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
        let credits = this.add.bitmapText(centerX, centerY + 180, 'myFont', 'Credits', 32)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => credits.setScale(1.2))
            .on('pointerout', () => credits.setScale(1))
            .on('pointerdown', () => {
                sound.play();
                this.scene.start('creditsScene');  // Example scene change
            });

                    // For the 'Credits' button
        let howTo = this.add.bitmapText(centerX, centerY + 230, 'myFont', 'How to Play', 32)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => howTo.setScale(1.2))
        .on('pointerout', () => howTo.setScale(1))
        .on('pointerdown', () => {
            sound.play();
            this.scene.start('howtoscene');  // Example scene change
        });
    }
    
    



}