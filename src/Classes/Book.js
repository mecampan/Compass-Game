class Book extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

    }

    collect() {
        // destroy book sprite 
        // add ui to bottom of screen to confirm book has been collected
        this.disableBody(true, true);
        this.setVisible(false);
    }
}
