class PlayerControl {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.isWalking = false;

        // Scale and adjust player hitbox
        this.player.setScale(0.5);
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.75, true);

        // Add sounds
        this.walkSound = this.scene.sound.add('walk_sfx', { loop: true });

        // Set up animations
        if (!loadAnim) this.createAnimations();
        this.player.anims.play('frontIdle');

        // Set up controls
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    createAnimations() {
        const anims = this.scene.anims;

        anims.create({
            key: 'frontIdle',
            frames: [{ key: 'player', frame: 'frontIdle1' }, { key: 'player', frame: 'frontIdle2' }],
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'frontWalk',
            frames: anims.generateFrameNames('player', { prefix: 'front', start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'backIdle',
            frames: [{ key: 'player', frame: 'backIdle1' }, { key: 'player', frame: 'backIdle2' }],
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'backWalk',
            frames: anims.generateFrameNames('player', { prefix: 'back', start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'rightIdle',
            frames: [{ key: 'player', frame: 'rightIdle1' }, { key: 'player', frame: 'rightIdle2' }],
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'rightWalk',
            frames: anims.generateFrameNames('player', { prefix: 'right', start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'leftWalk',
            frames: anims.generateFrameNames('player', { prefix: 'right', start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        loadAnim = true;
    }

    handleCollision(player, wall) {
        if (player.body.blocked.left) player.setVelocityX(Math.max(player.body.velocity.x, 0));
        if (player.body.blocked.right) player.setVelocityX(Math.min(player.body.velocity.x, 0));
        if (player.body.blocked.up) player.setVelocityY(Math.max(player.body.velocity.y, 0));
        if (player.body.blocked.down) player.setVelocityY(Math.min(player.body.velocity.y, 0));
    }

    stopWalkSound() {
        if (this.walkSound.isPlaying) this.walkSound.stop();
    }

    update() {
        const speed = 80;
        const player = this.player;
        
        player.setVelocity(0);  // Reset velocity each frame

        let isMoving = false;

        if ((this.cursors.left.isDown || this.keys.A.isDown) && !player.body.blocked.left) {
            player.setVelocityX(-speed);
            player.setFlip(true, false);
            player.anims.play('leftWalk', true);
            isMoving = true;
        } else if ((this.cursors.right.isDown || this.keys.D.isDown) && !player.body.blocked.right) {
            player.setVelocityX(speed);
            player.setFlip(false, false);
            player.anims.play('rightWalk', true);
            isMoving = true;
        }

        if ((this.cursors.up.isDown || this.keys.W.isDown) && !player.body.blocked.up) {
            player.setVelocityY(-speed);
            player.anims.play('backWalk', true);
            isMoving = true;
        } else if ((this.cursors.down.isDown || this.keys.S.isDown) && !player.body.blocked.down) {
            player.setVelocityY(speed);
            player.anims.play('frontWalk', true);
            isMoving = true;
        }

        // Handle walking sound
        if (isMoving && !this.isWalking) {
            this.walkSound.play();
            this.isWalking = true;
        } else if (!isMoving && this.isWalking) {
            this.stopWalkSound();
            this.isWalking = false;
            player.anims.stop(); // Stop animation on no movement
        }
    }
}
