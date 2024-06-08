class HUD extends Phaser.Scene {
    constructor() {
        super({ key: 'hudScene' });
    }

    create() {
        this.bookHudDisplay = [];
        for (let i = 0; i < 3; i++) {
            let bookHudPos = 120 + i * 50;
            let bookHud = this.add.sprite(bookHudPos, this.scale.height - 25, 'spell_book1');
            bookHud.setVisible(false);
            this.bookHudDisplay.push(bookHud);
        }

        this.add.text(20, this.scale.height - 40, 'Books: ', {
            fontFamily: 'cursive',
            fontSize: '24px',
            color: '#ffffff',
        });

        this.events.on('updateHud', this.updateHud, this);
    }

    updateHud(collectedBooks) {
        // Update the HUD elements based on the collected book count
        for (let i = 0; i < this.bookHudDisplay.length; i++) {
            this.bookHudDisplay[i].setVisible(i < collectedBooks);
        }
    }

    update() {
    }
}
