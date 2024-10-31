class Credits extends Phaser.Scene{
    constructor() {
        super("creditsScene");
    }

    create(){
        //let sound = this.sound.add('ui_sound');

        // Centering text based on the game's configuration
        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;

        this.add.bitmapText(centerX, centerY - 350, 'myFont', 'Credits', 56).setOrigin(0.5);

        this.add.bitmapText(centerX, centerY - 100, 'myFont', 'Level Designer: Luan Ta', 42).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - 200, 'myFont', 'Game Designers: Micheal Campanile, Jacqueline Gracey', 42).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'myFont', 'Asset Packs: Szadi Art, Bagong Games, LuizMelo', 42).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 120, 'myFont', 'Title Music:', 39).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 200, 'myFont', '"Myst on the Moor" Kevin MacLeod (incompetech.com)\n Licensed under Creative Commons: By Attribution 4.0 License\n http://creativecommons.org/licenses/by/4.0/', 36).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 350, 'myFont', 'FOV Code provided by Dominik Marczuk\n(https://bitbucket.org/umbraprojekt/mrpas)', 36).setOrigin(0.5);

        let back = this.add.bitmapText(centerX, centerY + 450, 'myFont', 'Back', 32)
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