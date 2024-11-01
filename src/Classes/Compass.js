class Compass {
    constructor(scene, x, y, texture) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.compass = null; // Initialize pipes as null, will be set in initializePipes
        this.compassID = null;
        this.target = null;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, null).setOrigin(0.5, 0.5).setScale(0.4);
        console.log(this.sprite);
    }

    collect() {
        this.sprite.disableBody(true, true);
        this.sprite.setVisible(false);
        console.log("Compass collected");

        let message = this.scene.add.bitmapText(this.x, this.y - 20, 'myFont', 'Compass Collected.', 5)
        .setOrigin(0.5);   

        // Make the message disappear after a short time
        this.scene.time.delayedCall(1000, () => {
            message.destroy();
        });

        this.sprite.destroy();
    }
}
