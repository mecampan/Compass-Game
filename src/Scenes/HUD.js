class HUD extends Phaser.Scene {
    constructor() {
        super({ key: 'hudScene' });
        this.playerx = 0;
        this.playery = 0;
    }

    create() {
        this.createCompassHud();
        this.events.on('updateHud', this.updateHud, this);
    }

    createCompassHud() {
        this.compassHudDisplay = [];
        // for (let i = 0; i < 3; i++) {
        //     let hudXpos = 80 + i * 150;
        //     let hudYPos = 80;
        //     let compassHud = new CompassHUD(this.mainScene, this, hudXpos, hudYPos, 3456, 3408, 'compass_image', 'compass_needle_image');
        //     compassHud.setVisible(false);
        //     compassHud.sprite.setInteractive({ draggable: true }); // Enable dragging
        //     this.compassHudDisplay.push(compassHud);
        // }
    }

    updateHud(pos) {
        let hudXpos = 80 + Math.random() * 150;
        let hudYPos = 80;
        let compassHud = new CompassHUD(this.mainScene, this, hudXpos, hudYPos, pos.x, pos.y, 'compass_image', 'compass_needle_image');
        compassHud.setVisible(true);
        compassHud.sprite.setInteractive({ draggable: true }); // Enable dragging
        this.compassHudDisplay.push(compassHud);
        // Update the HUD elements based on the collected book count
        //for (let i = 0; i < this.compassHudDisplay.length; i++) {
        //    this.compassHudDisplay[i].setVisible(i < collectedBooks);
        //    if(i === collectedBooks - 1){
        //        this.compassHudDisplay[i].targetX = pos.x;
        //        this.compassHudDisplay[i].targetY = pos.y;
        //    }
        //}
        console.log(this);
        let tmpCam = this.cameras.main;
        for (let HudCompass of this.compassHudDisplay){
            HudCompass.setPos(tmpCam.worldView.x + Math.random() * tmpCam.worldView.width, tmpCam.worldView.y + Math.random() * tmpCam.worldView.height);
        }
    }

    update() {
        for (let i = 0; i < this.compassHudDisplay.length; i++) {
            this.compassHudDisplay[i].updateNeedle();
        }
    }
}
