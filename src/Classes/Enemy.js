class Enemy {
    constructor(scene, x, y, texture, frame) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, frame).setOrigin(0.5, 0.5).setScale(0.4);
        this.stunned = false;
        this.attacking = false;

        this.sprite.body.setSize(50, 70); // Example values
        this.sprite.enemyInstance = this; // Reference to the Enemy instance

        this.sprite.anims.play('run');

        this.pathfinder = new Pathfinder(this.scene, this.sprite);
        this.pathfinder.create();
        this.pathfinder.roam(); // Start roaming when the enemy is created

        this.lastChaseTime = 0;
        this.chaseInterval = 500; // Chase update interval in milliseconds
    }

    enemyAttack() {
        if (!this.attacking) {
            this.attacking = true;
            this.pathfinder.stopCharacter();
            this.sprite.anims.play('attackB');

            this.scene.time.delayedCall(1000, () => {
                this.sprite.anims.play('run');
                this.pathfinder.roam();

                this.scene.time.delayedCall(500, () => {
                    this.attacking = false;
                });
            });
        }
    }

    enemyStun() {
        if (!this.stunned) {
            this.stunned = true;
            this.canAttack = false;
            this.sprite.anims.play('stunned');

            this.scene.time.delayedCall(10000, () => {
                this.stunned = false;
                this.canAttack = true;
                this.sprite.anims.play('run');
                this.pathfinder.roam();
            });
        }
    }

    renderDebug(graphics) {
        graphics.lineStyle(1, 0xff0000, 1); // Red color for collision boxes
        graphics.strokeRect(
            this.sprite.body.x,
            this.sprite.body.y,
            this.sprite.body.width,
            this.sprite.body.height
        );
    }

    update(time) {
        // Update logic for the enemy
        if (!this.stunned && !this.attacking) {
            if (this.pathfinder.chasing) {
                // Update the pathfinder more frequently to chase the player
                if (time > this.lastChaseTime + this.chaseInterval) {
                    this.pathfinder.chase();
                    this.lastChaseTime = time;
                }
            }
        }
    }
}