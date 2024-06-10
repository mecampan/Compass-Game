class PlayerControl {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        // Scale down the player size by half
        this.player.setScale(0.5);

        // Set the hitbox to half the player's width
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.75, true);

        if (loadAnim === false) {
            // Create animations
            this.createAnimations();
        }
        

        // Set default animation
        this.player.anims.play('frontIdle');

        // Create cursors for arrow keys and WASD
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

        // Front Idle
        anims.create({
            key: 'frontIdle',
            frames: [
                { key: 'player', frame: 'frontIdle1' },
                { key: 'player', frame: 'frontIdle2' }
            ],
            frameRate: 2,
            repeat: -1
        });

        // Front Walk
        anims.create({
            key: 'frontWalk',
            frames: anims.generateFrameNames('player', {
                prefix: 'front',
                start: 1,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        // Back Idle
        anims.create({
            key: 'backIdle',
            frames: [
                { key: 'player', frame: 'backIdle1' },
                { key: 'player', frame: 'backIdle2' }
            ],
            frameRate: 2,
            repeat: -1
        });

        // Back Walk
        anims.create({
            key: 'backWalk',
            frames: anims.generateFrameNames('player', {
                prefix: 'back',
                start: 1,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        // Right Idle
        anims.create({
            key: 'rightIdle',
            frames: [
                { key: 'player', frame: 'rightIdle1' },
                { key: 'player', frame: 'rightIdle2' }
            ],
            frameRate: 2,
            repeat: -1
        });

        // Right Walk
        anims.create({
            key: 'rightWalk',
            frames: anims.generateFrameNames('player', {
                prefix: 'right',
                start: 1,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        // Left Walk (flip right walk)
        anims.create({
            key: 'leftWalk',
            frames: anims.generateFrameNames('player', {
                prefix: 'right',
                start: 1,
                end: 8
            }),
            frameRate: 10,
            repeat: -1,
            yoyo: false,
        });

        // Left Idle (flip right idle)
        anims.create({
            key: 'leftIdle',
            frames: [
                { key: 'player', frame: 'rightIdle1'},
                { key: 'player', frame: 'rightIdle2'}
            ],
            frameRate: 2,
            repeat: -1
        });
        loadAnim = true;
    }

    update() {
        const speed = 200;
        const player = this.player;
        const cursors = this.cursors;
        const keys = this.keys;

        player.setVelocity(0);

        let isMovingHorizontally = false;
        let isMovingVertically = false;

        if (cursors.left.isDown || keys.A.isDown) {
            player.setVelocityX(-speed);
            isMovingHorizontally = true;
        } else if (cursors.right.isDown || keys.D.isDown) {
            player.setVelocityX(speed);
            isMovingHorizontally = true;
        }

        if (cursors.up.isDown || keys.W.isDown) {
            player.setVelocityY(-speed);
            isMovingVertically = true;
        } else if (cursors.down.isDown || keys.S.isDown) {
            player.setVelocityY(speed);
            isMovingVertically = true;
        }

        if (isMovingHorizontally && isMovingVertically) {
            player.setVelocity(player.body.velocity.x * 0.7071, player.body.velocity.y * 0.7071);
            if (player.body.velocity.y < 0) {
                player.anims.play('backWalk', true);
            } else {
                player.anims.play('frontWalk', true);
            }
        } else if (isMovingHorizontally) {
            if (player.body.velocity.x < 0) {
                player.setFlip(true, false);
                player.anims.play('leftWalk', true);
            } else {
                player.setFlip(false, false);
                player.anims.play('rightWalk', true);
            }
        } else if (isMovingVertically) {
            if (player.body.velocity.y < 0) {
                player.anims.play('backWalk', true);
            } else {
                player.anims.play('frontWalk', true);
            }
        } else {
            if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
                if (player.anims.currentAnim) {
                    let currentKey = player.anims.currentAnim.key;
                    if (currentKey.includes('front')) {
                        player.anims.play('frontIdle', true);
                    } else if (currentKey.includes('back')) {
                        player.anims.play('backIdle', true);
                    } else if (currentKey.includes('right')) {
                        player.anims.play('rightIdle', true);
                    } else if (currentKey.includes('left')) {
                        player.anims.play('leftIdle', true);
                    }
                }
            }
        }
    }
}
