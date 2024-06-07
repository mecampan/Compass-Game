class Pathfinder {
    constructor(scene, activeCharacter) {
        this.scene = scene;
        this.activeCharacter = activeCharacter;
        this.TILESIZE = 16;
        this.currentTween = null; // Track the current tween
        this.chasing = false;
        this.searching = false; // Enemy will continue to chase player for a set time outside of FOV
        this.roaming = false;
        this.currentTravelDot = null; // Track the current travel dot
    }

    create() {
        // Create grid of visible tiles for use with path planning
        let dungeonGrid = this.layersToGrid([this.scene.groundLayer, this.scene.wallLayer]);

        let walkables = [
            ...this.range(896, 907),
            ...this.range(967, 978),
            ...this.range(1038, 1049),
            ...this.range(1109, 1120),
            ...this.range(1180, 1191),
            ...this.range(1251, 1262),
        ];

        //console.log(walkables);

        // Initialize EasyStar pathfinder
        this.finder = new EasyStar.js();

        // Pass grid information to EasyStar
        this.finder.setGrid(dungeonGrid);

        // Tell EasyStar which tiles can be walked on
        this.finder.setAcceptableTiles(walkables);

        // Handle mouse clicks (commented out)
        // this.scene.input.on('pointerup', this.handleClick, this);
    }

    // Function to generate a range of numbers
    range(start, end) {
        let array = [];
        for (let i = start; i <= end; i++) {
            array.push(i);
        }
        return array;
    }

    tileXtoWorld(tileX) {
        return tileX * this.TILESIZE;
    }

    tileYtoWorld(tileY) {
        return tileY * this.TILESIZE;
    }

    layersToGrid(layers) {
        let grid = [];
        for (let i = 0; i < this.scene.map.height; i++) {
            grid[i] = new Array(this.scene.map.width);
        }

        let arrayOfLayers = layers;
        for (let i = 0; i < arrayOfLayers.length; i++) {
            for (let y = 0; y < this.scene.map.height; y++) {
                for (let x = 0; x < this.scene.map.width; x++) {
                    let tile = arrayOfLayers[i].getTileAt(x, y);
                    if (tile) {
                        grid[y][x] = tile.index;
                    }
                }
            }
        }
        return grid;
    }

    handleClick(pointer) {
        let x = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y).x;
        let y = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y).y;
        let toX = Math.floor(x / this.TILESIZE);
        let toY = Math.floor(y / this.TILESIZE);
        let fromX = Math.floor(this.activeCharacter.x / this.TILESIZE);
        let fromY = Math.floor(this.activeCharacter.y / this.TILESIZE);

        // Boundary checks
        if (toX < 0 || toY < 0 || toX >= this.scene.map.width || toY >= this.scene.map.height) {
            console.warn("Click position is outside the map boundaries.");
            return;
        }

        //console.log('going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')');

        // Create a marker at the clicked position
        let marker = this.scene.add.sprite(toX * this.TILESIZE, toY * this.TILESIZE, null).setScale(0.1);
        marker.setDepth(10); // Ensure the marker appears above other sprites

        // Destroy the marker after a few seconds
        this.scene.time.delayedCall(5000, () => {
            marker.destroy();
        });

        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                //console.log(path);
                this.moveCharacter(path, this.activeCharacter);
            }
        });
        this.finder.calculate();
    }

    // Remove existing tween if any
    stopCharacter() {
        if (this.currentTween) {
            //console.log(this.currentTween);
            this.currentTween.stop();
            this.currentTween = null; // Nullify the reference
        }
    }

    moveCharacter(path, character, onComplete) {
        this.stopCharacter();

        var tweens = [];
        for (var i = 0; i < path.length - 1; i++) {
            var ex = path[i + 1].x;
            var ey = path[i + 1].y;

            // Place a travel dot at the next position
            // Place a travel dot at the end position
            if (i === path.length - 2) {
                this.placeTravelDot(this.tileXtoWorld(ex), this.tileYtoWorld(ey));
            }
            tweens.push({
                x: ex * this.TILESIZE,
                y: ey * this.TILESIZE,
                duration: 300,
                onStart: () => {
                    if (character.x > ex * this.TILESIZE) {
                        character.flipX = true; // Flip sprite when moving left
                    } else {
                        character.flipX = false; // Reset flip when moving right
                    }
                },
                onComplete: i === path.length - 2 ? () => {
                    onComplete(); // Call onComplete callback
                    //console.log("Set chasing to false");
                    this.chasing = false;
                    this.roaming = false;
                } : null
            });
        }

        // Chain tweens
        this.currentTween = this.scene.tweens.chain({
            targets: character,
            tweens: tweens
        });
    }

    roam() {
        this.roaming = true;
        this.chasing = false;

        // Choose a random point to move to within the map boundaries
        let toX = Phaser.Math.Between(0, this.scene.map.width - 1);
        let toY = Phaser.Math.Between(0, this.scene.map.height - 1);

        let fromX = Math.floor(this.activeCharacter.x / this.TILESIZE);
        let fromY = Math.floor(this.activeCharacter.y / this.TILESIZE);

        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            if (path === null || path.length === 0) {
                //console.warn("Path was not found or empty.");
                this.roam(); // Try to roam to another random point
            } else {
                this.moveCharacter(path, this.activeCharacter, () => {
                    this.roam(); // Start roaming again after reaching the destination
                });
            }
        });
        this.finder.calculate();
    }

    chase() {
        this.chasing = true;
        this.roaming = false;

        // Grab the player location
        let toX = Math.floor(this.scene.player.x / this.TILESIZE);
        let toY = Math.floor(this.scene.player.y / this.TILESIZE);

        // Enemy's current location
        let fromX = Math.floor(this.activeCharacter.x / this.TILESIZE);
        let fromY = Math.floor(this.activeCharacter.y / this.TILESIZE);

        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            if (path === null || path.length === 0) {
                //console.warn("Path was not found or empty.");
                this.roam(); // Try to roam to another random point
            } else {
                this.moveCharacter(path, this.activeCharacter, () => {
                    if (this.searching) {
                        this.chase(); // Continue chasing player outside of FOV for a bit
                    }
                    else {
                        this.roam(); // Start roaming again after reaching the destination
                    }
                });
            }
        });
        this.finder.calculate();
    }

    setCost(tileset) {
        for (let i = tileset.firstgid; i < tileset.total; i++) {
            let props = tileset.getTileProperties(i);
            if (props) {
                let cost = props.cost;
                this.finder.setTileCost(i, cost);
            }
        }
    }

    searchingTimer() {
        // If a timer is already running, remove it
        if (this.searchingTimerEvent) {
            this.searchingTimerEvent.remove(false);
        }
    
        // Set the searching state and create a new timer
        this.searching = true;
        this.searchingTimerEvent = this.scene.time.delayedCall(5000, () => {
            this.searching = false;
        });
    }    

    placeTravelDot(x, y) {
        // Remove the current travel dot if it exists
        if (this.currentTravelDot) {
            this.currentTravelDot.destroy();
        }

        // Create a new dot at the specified position
        this.currentTravelDot = this.scene.add.circle(x, y, 5, 0xff0000); // A small red dot
        this.currentTravelDot.setDepth(10); // Ensure the dot appears above other sprites
    }

}