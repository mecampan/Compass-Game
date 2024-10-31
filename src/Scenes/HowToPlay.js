class HowToPlay extends Phaser.Scene{
    constructor() {
        super("howtoscene");
    }

    create(){
        //let sound = this.sound.add('ui_sound');
    
        // Fade in the scene
        this.cameras.main.fadeIn(500, 0, 0, 0);
    
        // Set the bounds of the world to match the scaled map dimensions
        // this.physics.world.setBounds(0, 0, this.map.widthInPixels * scaleX, this.map.heightInPixels * scaleY);
    
        // Centering text based on the game's configuration
        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;
    
        this.add.bitmapText(centerX, centerY - 350, 'myFont', 'How to Play', 56).setOrigin(0.5);
    
        this.add.bitmapText(centerX, centerY - 200, 'myFont', 'Controls', 42).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - 50, 'myFont', 'Move Up - W / Up Arrow\nMove Down - S / Down Arrow\nMove Right - A / Left Arrow\nMove Right - D / Right Arrow\n Stun Enemies - Space Key', 42).setOrigin(0.5);

        this.add.bitmapText(centerX, centerY + 200, 'myFont', 'Pick up 3 books and bring them to the alter to break the evil ritual and escape the dungeon. Oil bottles increase lantern fuel allowing you to see further.', 42).setOrigin(0.5).setMaxWidth(1000);

        let back = this.add.bitmapText(centerX, centerY + 400, 'myFont', 'Back', 32)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => back.setScale(1.2))
            .on('pointerout', () => back.setScale(1))
            .on('pointerdown', () => {
                //sound.play();
                this.scene.stop("creditsScene");
                this.scene.start("titleScreenScene");
            });    
    
    
    }
    
    



}