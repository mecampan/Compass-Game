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
        this.events.on('refilOil', this.refilOil, this);

        // Create a container for the minimap
        this.minimapContainer = this.add.container(this.scale.width - 270, 10); // Positioning in the top right corner

        // Listen for the createMinimap and updateMinimap events
        if (minimapCreated === false) {
            this.events.on('createMinimap', this.createMinimap, this);
        }
        
        this.events.on('updateMinimap', this.updateMinimap, this);
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

    useOilStun() {
        if (this.oilAmount >= 10) {
            this.oilAmount-=10;
            this.setOilLevel();
        }
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

    createMinimap(minimapGraphics, width, height) {
        // Remove any existing minimap from the container
        if (this.minimapContainer) {
            this.minimapContainer.removeAll(true);
        } else {
            //console.error('minimapContainer is not defined');
            return;
        }
        
        // Add the background square
        const background = this.add.graphics();
        background.fillStyle(0x000000, 0.5); // Black color with 50% opacity
        background.fillRect(0, 0, width, height);
        background.setScrollFactor(0); // Ensure it stays in place
        this.minimapContainer.add(background);
        
        // Add the new minimap graphics to the container
        this.minimapGraphics = minimapGraphics;
        this.minimapGraphics.setPosition(0, 0);
        this.minimapContainer.add(this.minimapGraphics);
        
    }
    

    updateMinimap(minimapGraphics) {
        
        if (!this.minimapGraphics) {
            //console.error('minimapGraphics is not defined');
            return;
        }
    
        // Ensure the minimap graphics in the container are updated
        this.minimapGraphics = minimapGraphics;
    }

    update() {
    }
}
