class SceneTransition {
    constructor(scene, objectName, nextSceneName, player) {
        this.scene = scene;
        this.objectName = objectName;
        this.nextSceneName = nextSceneName;
        this.player = player;

        // Find the object in the object layer
        const objectLayer = this.scene.map.getObjectLayer('sceneLayer');
        if (!objectLayer) {
            console.error(`Object layer 'sceneLayer' not found in map`);
            return;
        }

        const transitionObject = objectLayer.objects.find(obj => obj.name === this.objectName);

        if (transitionObject) {
            // Create an invisible rectangle for the object
            const rectangle = this.scene.add.rectangle(
                transitionObject.x + transitionObject.width / 2,
                transitionObject.y + transitionObject.height / 2,
                transitionObject.width,
                transitionObject.height
            ).setOrigin(0.5, 0.5);

            // Enable physics for the rectangle
            this.scene.physics.add.existing(rectangle, true);

            // Set the name of the rectangle to match the transition object name
            rectangle.name = this.objectName;

            // Add collision detection between player and the rectangle
            this.scene.physics.add.overlap(this.player, rectangle, this.startSceneTransition, null, this);

            console.log(`Transition object ${this.objectName} created at (${transitionObject.x}, ${transitionObject.y})`);
        } else {
            console.error(`Transition object ${this.objectName} not found in object layer`);
        }
    }

    startSceneTransition(player, object) {
        // Check if the object collided with is the specified object
        if (object.name === this.objectName) {
            console.log(`Player collided with ${this.objectName}`);
            // Fade out the current scene
            this.scene.cameras.main.fadeOut(500, 0, 0, 0);

            // Transition to the next scene after a delay
            this.scene.time.delayedCall(500, this.transitionToNextScene, [], this);
        } else {
            console.log(`Collision with ${object.name}, not the target ${this.objectName}`);
        }
    }

    transitionToNextScene() {
        // Create a black rectangle to cover the screen
        const rectangle = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x000000
        ).setOrigin(0.5);
    
        // Set the alpha to 0 (fully transparent)
        rectangle.alpha = 0;
    
        // Fade out the current scene
        this.scene.tweens.add({
            targets: rectangle,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                // After fade out, start the next scene
                console.log(`Transitioning to ${this.nextSceneName}`);
                this.scene.scene.start(this.nextSceneName, {}, () => {
                    // When the next scene starts, destroy the rectangle and fade in the camera
                    this.scene.cameras.main.fadeIn(500, 0, 0, 0);
                    rectangle.destroy();
                });
            }
        });
    }
    
    
}
