class EndScene extends Phaser.Scene{
    constructor() {
        super("EndScene");
    }

    create(){
        let sound = this.sound.add('ui_sound');

        // Centering text based on the game's configuration
        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;

        this.add.bitmapText(centerX, centerY - 200, 'myFont', 'Game Over', 56).setOrigin(0.5);

        let playAgain = this.add.bitmapText(centerX, centerY, 'myFont', 'Play Again', 42)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => playAgain.setScale(1.2))
            .on('pointerout', () => playAgain.setScale(1))
            .on('pointerdown', () => {
                sound.play();
                this.scene.stop("EndScene");
                this.scene.start("level1Scene");
            });


        let home = this.add.bitmapText(centerX, centerY + 100, 'myFont', 'Home', 42)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => home.setScale(1.2))
            .on('pointerout', () => home.setScale(1))
            .on('pointerdown', () => {
                sound.play();
                this.scene.stop("EndScene");
                this.scene.start("titleScreenScene");
            });


    }
}