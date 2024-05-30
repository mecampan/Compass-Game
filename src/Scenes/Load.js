class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
    }

    create() {

        // ...and pass to the next Scene
        this.scene.start("level1Scene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}
