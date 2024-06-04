class Enemy {
    constructor(scene, x, y, image) {
        this.scene = scene;
        this.sprite = this.scene.add.sprite(x, y, image).setOrigin(0.5, 1).setScale(0.4);
        this.stunned = false;
        this.enemyAttack = true; // Determines if enemy can hurt the player

        this.pathfinder = new Pathfinder(this.scene, this.sprite);
        this.pathfinder.create();
        this.pathfinder.roam(); // Start roaming when the enemy is created
    }

    enemyStun(stunned) {
        if (!this.stunned) {
            this.stunned = true;
            this.enemyAttack = false;

            // Prevent the enemy from being stunned more than once
            this.scene.time.delayedCall(5000, () => {
                this.stunned = false;
                this.enemyAttack = true;
                this.pathfinder.roam();
            });
        }
    }

    update() {
        // Update logic for the enemy
    }
}