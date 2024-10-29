class Compass {
    constructor(scene, x, y, texture, frame) {
        this.scene = scene;
        this.compass = null; // Initialize pipes as null, will be set in initializePipes
        this.compassID = null;
        this.target = null;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, frame).setOrigin(0.5, 0.5).setScale(0.4);
    }

    collect() {
        this.disableBody(true, true);
        this.setVisible(false);
        console.log("Book collected");

        let message = this.scene.add.bitmapText(this.x, this.y - 20, 'myFont', 'Compass Collected.', 5)
        .setOrigin(0.5);    

        // Make the message disappear after a short time
        this.scene.time.delayedCall(1000, () => {
            message.destroy();
        });

        this.destroy();
    }
}
