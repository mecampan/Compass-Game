class HUD extends Phaser.Scene {
    constructor() {
        super({ key: 'hudScene' });
    }

    create() {
        this.compassHudDisplay = [];

        // Listen for the event to add a compass to the HUD
        this.events.on('addCompassToHud', this.addCompassHud, this);
    }

    addCompassHud() {
        let hudXpos = 80 + this.compassHudDisplay.length * 150;
        let hudYPos = 80;

        // Create a new bouncing compass object
        let compassHud = this.physics.add.sprite(hudXpos, hudYPos, 'compass_image').setScale(4);
        compassHud.setBounce(1);
        compassHud.setCollideWorldBounds(true); // Keep within HUD bounds
        compassHud.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));

        compassHud.setInteractive({ draggable: true });
        this.input.setDraggable(compassHud);

        // Drag event listeners
        compassHud.on('drag', (pointer, dragX, dragY) => {
            compassHud.x = dragX;
            compassHud.y = dragY;
        });

        // Add to the HUD display array for tracking
        this.compassHudDisplay.push(compassHud);
    }
}
