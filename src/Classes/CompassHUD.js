class CompassHUD {
    constructor(scene, HUD, x, y, targetX, targetY, texture, needleTexture) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.scene = scene
        this.HUD = HUD;
        this.compass = null; // Initialize pipes as null, will be set in initializePipes
        this.compassID = null;
        this.target = null;
        this.sprite = this.HUD.physics.add.sprite(x, y, texture, null).setOrigin(0.5, 0.5).setScale(4);
        this.needle = this.HUD.physics.add.sprite(x, y, needleTexture, null).setOrigin(0.5, 0.5).setScale(0.1);
        let angles = [0, 90, 180, 270];
        this.angleOffset = angles[(Math.floor(Math.random() * angles.length))];
        this.updateNeedle();

        this.sprite.on('drag', (pointer, dragX, dragY) => {
            this.x = dragX;
            this.y = dragY;
            this.sprite.x = dragX;
            this.sprite.y = dragY;
            this.needle.x = dragX;
            this.needle.y = dragY;
            //let mainCamera = this.scene.cameras.main;
            //this.scene.sprite.x = mainCamera.worldView.x + this.sprite.x / 4 + 50;
            //this.scene.sprite.y = mainCamera.worldView.y + this.sprite.y / 4;
            //console.log("x: " + dragX + ", y: " + dragY);
            //console.log("player x: " + HUD.playerx + ", y: " + HUD.playery);
            this.updateNeedle();
        });
    }

    updateNeedle(){
        let mainCamera = this.scene.cameras.main;
        //console.log(mainCamera);
        this.needle.angle = this.angleOffset + Math.atan2(-((mainCamera.worldView.x + this.x / mainCamera.zoom) - this.targetX), (mainCamera.worldView.y + this.y / mainCamera.zoom) - this.targetY).toDeg();
    }

    setVisible(bVisable){
        this.sprite.setVisible(bVisable);
        this.needle.setVisible(bVisable);
    }
}
