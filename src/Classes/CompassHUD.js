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
        let angles = [0];
        this.angleOffset = angles[(Math.floor(Math.random() * angles.length))];
        this.updateNeedle();

        this.sprite.on('drag', (pointer, dragX, dragY) => {
            this.x = dragX;
            this.y = dragY;
            this.sprite.x = dragX;
            this.sprite.y = dragY;
            this.needle.x = dragX;
            this.needle.y = dragY;
            this.updateNeedle();
            this.sprite.setVelocity(0);
        });
    
        this.sprite.on('dragend', () => {
            this.sprite.setBounce(1);
            this.sprite.setCollideWorldBounds(true); // Keep within HUD bounds
            this.sprite.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
            this.updateNeedle();
        });

        this.sprite.setBounce(1);
        this.sprite.setCollideWorldBounds(true); // Keep within HUD bounds
        this.sprite.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    }

    updateNeedle(){
        let mainCamera = this.scene.cameras.main;
        //console.log(mainCamera);
        this.needle.angle = this.angleOffset + Math.atan2(-((mainCamera.worldView.x + this.x / mainCamera.zoom) - this.targetX), (mainCamera.worldView.y + this.y / mainCamera.zoom) - this.targetY).toDeg();
    }

    updateNeedlePos() {
        this.needle.x = this.sprite.x;
        this.needle.y = this.sprite.y;
    }

    setVisible(bVisable){
        this.sprite.setVisible(bVisable);
        this.needle.setVisible(bVisable);
    }

    update() {
        this.updateNeedle();
        this.updateNeedlePos();
    }
}
