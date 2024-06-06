class Enemy {
    constructor(scene, x, y, texture, frame) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, frame).setOrigin(0.5, 0.5).setScale(0.4);
        this.stunned = false;
        this.canAttack = true; // Determines if enemy can hurt the player

        // Play idle animation
        this.sprite.anims.play('run');

        this.pathfinder = new Pathfinder(this.scene, this.sprite);
        this.pathfinder.create();
        //this.pathfinder.roam(); // Start roaming when the enemy is created
        this.pathfinder.chase(); // Start chasing the player
    }

    enemyAttack() {
        this.pathfinder.stopCharacter();
        this.scene.time.delayedCall(3000, () => {
            this.pathfinder.roam();
        });
    }

    enemyStun(stunned) {
        if (!this.stunned) {
            this.stunned = true;
            this.canAttack = false;

            // Prevent the enemy from being stunned more than once
            this.scene.time.delayedCall(5000, () => {
                this.stunned = false;
                this.canAttack = true;
                this.pathfinder.roam();
            });
        }
    }

    update() {
        // Update logic for the enemy
    }
}