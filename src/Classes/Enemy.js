class Enemy {
    constructor(scene, x, y, texture, frame) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, frame).setOrigin(0.5, 0.5).setScale(0.4);
        this.stunned = false;
        this.attacking = false;

        this.sprite.body.setSize(60, 60); // Example values
        this.sprite.enemyInstance = this; // Reference to the Enemy instance

        this.sprite.anims.play('run');
        this.attackSound = this.scene.sound.add('enemy_attack_sfx');
        this.screamsfx = this.scene.sound.add('scream_sfx');

        this.pathfinder = new Pathfinder(this.scene, this.sprite);
        this.pathfinder.create();
        this.pathfinder.roam(); // Start roaming when the enemy is created
    }

    enemyAttack() {
        if (!this.attacking && !this.stunned) {
            this.attacking = true;
            this.pathfinder.stopCharacter();
            this.sprite.anims.play('attackA');
            this.attackSound.play();

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
        //console.log("Enemy stunned", this.stunned);
        if (!this.stunned) {
            this.stunned = true;
            this.canAttack = false;
            this.pathfinder.stopCharacter();
            this.sprite.anims.play('stunned');
            this.screamsfx.play();

            this.scene.time.delayedCall(5000, () => {
                //console.log("Enemy no longer stunned", this.stunned);
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

    update() {
        // Update logic for the enemy
        if (!this.pathfinder.chasing && !this.attacking) {
            //this.pathfinder.chase(this.scene.player);
        }
    }
}