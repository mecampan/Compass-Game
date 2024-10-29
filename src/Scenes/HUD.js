class HUD extends Phaser.Scene {
    constructor() {
        super({ key: 'hudScene' });
    }

    create() {
        this.createCompassHud();
        this.events.on('updateHud', this.updateHud, this);
    }

    createCompassHud() {
        this.compassHudDisplay = [];
        for (let i = 0; i < 3; i++) {
            let hudXpos = 80 + i * 150;
            let hudYPos = 80;
            let compassHud = this.add.sprite(hudXpos, hudYPos, 'compass_image').setScale(4);
            compassHud.setVisible(false);
            compassHud.setInteractive({ draggable: true }); // Enable dragging
            this.compassHudDisplay.push(compassHud);
    
            // Drag event listeners
            compassHud.on('drag', (pointer, dragX, dragY) => {
                compassHud.x = dragX;
                compassHud.y = dragY;
            });
        }
    }

    updateHud(collectedBooks) {
        // Update the HUD elements based on the collected book count
        for (let i = 0; i < this.compassHudDisplay.length; i++) {
            this.compassHudDisplay[i].setVisible(i < collectedBooks);
        }
    }

    update() {
    }
}
