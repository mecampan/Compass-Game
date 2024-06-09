class HUD extends Phaser.Scene {
    constructor() {
        super({ key: 'hudScene' });

        this.oilBar;
        this.oilAmount = 100;
    }

    create() {
        this.createBookHud();
        this.createLanternHud();
        this.oilDeplete();

        this.events.on('updateHud', this.updateHud, this);
    }

    createLanternHud() {
        this.oilBar = this.add.sprite(30, this.scale.height - 66, 'oilBar').setOrigin(0.5, 1);
        this.setOilLevel();
        this.add.sprite(60, this.scale.height - 96, 'lantern').setScale(0.5);
    }

    setOilLevel() {
        //scale the bar
        this.oilBar.scaleY = this.oilAmount / 100;
    }

    getOilAmount() {
        return this.oilAmount / 100;
    }

    refilOil() {
        this.oilAmount += 50;
        if (this.oilAmount > 100) {
            this.oilAmount = 100;
        }
        this.setOilLevel();
    }

    oilDeplete() {
        this.time.delayedCall(1000, () => {
            if (this.oilAmount > 0) {
                this.oilAmount--;
            }
            this.setOilLevel();
            this.oilDeplete();
        });
    }

    createBookHud() {
        this.bookHudDisplay = [];
        for (let i = 0; i < 3; i++) {
            let bookHudPos = 120 + i * 50;
            let bookHud = this.add.sprite(bookHudPos, this.scale.height - 25, 'spell_book1');
            bookHud.setVisible(false);
            this.bookHudDisplay.push(bookHud);
        }

        this.add.bitmapText(20, this.scale.height - 40, 'myFont', 'Books: ', 24);
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
