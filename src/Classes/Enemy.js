class Enemy {
    constructor(scene, x, y, image) {
        this.scene = scene;
        this.sprite = this.scene.add.sprite(x, y, image).setOrigin(0.5, 1).setScale(0.5);
        this.pathfinder = new Pathfinder(this.scene, this.sprite);
        this.pathfinder.create();
        this.pathfinder.roam(); // Start roaming when the enemy is created
    }

    moveTo(pointer) {
        //this.pathfinder.handleClick(pointer);
    }

    update() {
        // Update logic for the enemy
    }
}