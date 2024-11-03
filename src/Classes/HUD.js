class HUD extends Phaser.Scene {
    constructor() {
        super({ key: 'hudScene' });
        this.playerx = 0;
        this.playery = 0;
        this.compassHudDisplay = [];
    }

    create() {
        this.events.on('updateHud', this.updateHud, this);
    }

    updateHud(pos) {
        let hudXpos = 80 + Math.random() * 150;
        let hudYPos = 80;
        let compassHud = new CompassHUD(this.mainScene, this, hudXpos, hudYPos, pos.x, pos.y, 'compass_image', 'compass_needle_image');
        compassHud.setVisible(true);
        compassHud.sprite.setInteractive({ draggable: true }); // Enable dragging
        this.compassHudDisplay.push(compassHud);
    }

    update() {
        for (let i = 0; i < this.compassHudDisplay.length; i++) {
            this.compassHudDisplay[i].updateNeedle();
        }
    }
}
