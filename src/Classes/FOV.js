class FOV {
    constructor(scene, entity, isTransparent, isPlayer = false) {
        this.scene = scene;
        this.entity = entity;
        this.isPlayer = isPlayer;
        this.map = this.scene.map;
        this.mapWidth = this.map.width;
        this.mapHeight = this.map.height;
        this.isTransparent = isTransparent;
        this.mrpas = new Mrpas(this.mapWidth, this.mapHeight, this.checkTransparency.bind(this));
        this.visibleTiles = [];
        this.prevX = null;
        this.prevY = null;
        this.fovGraphics = null; // Graphics object for drawing the FOV outline
        this.showFOVOutline = false; // Boolean to track FOV outline visibility
        this.movingFrequency = 0;
    }

    calculateFOV(originX, originY, radius) {
        this.visibleTiles = [];
        this.mrpas.compute(
            originX,
            originY,
            radius,
            (x, y) => this.checkTransparency(x, y),
            (x, y) => this.visibleTiles.push({ x, y })
        );

        if (this.isPlayer) {
            this.updateTileVisibility(originX, originY, radius);
            this.checkEnemiesInFOV(); // Check enemies in FOV after updating tile visibility
        }
    }

    getVisibleTiles() {
        return this.visibleTiles;
    }

    hasMoved(currentX, currentY) {
        const moved = this.prevX !== currentX || this.prevY !== currentY;
        this.prevX = currentX;
        this.prevY = currentY;
        return moved;
    }

    updateFOV(radius) {
        const currentX = this.map.worldToTileX(this.entity.x);
        const currentY = this.map.worldToTileY(this.entity.y);
        if (this.hasMoved(currentX, currentY)) {
            this.calculateFOV(currentX, currentY, radius);
        } else {
            this.checkEnemiesInFOV(); // Ensure FOV check is done even if player hasn't moved
        }
    }

    checkEnemiesInFOV() {
        this.scene.enemies.getChildren().forEach(enemySprite => {
            const enemy = enemySprite.enemyInstance; // Reference to the Enemy instance
            const enemyTileX = this.map.worldToTileX(enemySprite.x);
            const enemyTileY = this.map.worldToTileY(enemySprite.y);
            let isInFOV = false;

            for (let { x, y } of this.visibleTiles) {
                if (x === enemyTileX && y === enemyTileY) {
                    isInFOV = true;
                    break;
                }
            }

            if (this.movingFrequency % 50 === 0) {
                if (enemy) {
                    if (isInFOV) {
                        //console.log("Enemy in FOV");
                        enemy.pathfinder.chase();
                    }

                    else {
                        //console.log("Not in FOV");
                        // Ensure roaming is only called once to prevent constant updates to path
                        if (!enemy.pathfinder.roaming && !enemy.pathfinder.chasing && !enemy.pathfinder.searching) {
                            enemy.pathfinder.roam();
                        }
                    }
                }
            }

            if (enemy.pathfinder.chasing && !isInFOV) {
                enemy.pathfinder.searchingTimer();
            }          
        });
    }

    updateTileVisibility(originX, originY, radius) {
        const camera = this.scene.cameras.main;
        const bounds = new Phaser.Geom.Rectangle(
            this.map.worldToTileX(camera.worldView.x) - 1,
            this.map.worldToTileY(camera.worldView.y) - 1,
            this.map.worldToTileX(camera.worldView.width) + 2,
            this.map.worldToTileY(camera.worldView.height) + 3
        );

        for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
            for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
                if (y < 0 || y >= this.map.height || x < 0 || x >= this.map.width) {
                    continue;
                }

                const groundTile = this.scene.groundLayer.getTileAt(x, y);
                if (groundTile) {
                    groundTile.alpha = 0;
                }

                const wallTile = this.scene.wallLayer.getTileAt(x, y);
                if (wallTile) {
                    wallTile.alpha = 0;
                }
            }
        }

        this.visibleTiles.forEach(({ x, y }) => {
            const groundTile = this.scene.groundLayer.getTileAt(x, y);
            const wallTile = this.scene.wallLayer.getTileAt(x, y);

            if (groundTile) {
                const distance = Phaser.Math.Distance.Between(originX, originY, x, y);
                const alpha = 1.4 - (distance / radius);
                groundTile.alpha = alpha;
            }

            if (wallTile) {
                const distance = Phaser.Math.Distance.Between(originX, originY, x, y);
                const alpha = 1.4 - (distance / radius);
                wallTile.alpha = alpha;
            }
        });

        if (this.showFOVOutline) {
            this.drawFOVOutline(); // Draw the FOV outline
        }
    }

    drawFOVOutline() {
        if (this.fovGraphics) {
            this.fovGraphics.clear(); // Clear previous drawings
        } else {
            this.fovGraphics = this.scene.add.graphics();
        }

        this.fovGraphics.lineStyle(1, 0xff0000, 1); // Red outline

        this.visibleTiles.forEach(({ x, y }) => {
            const worldX = this.map.tileToWorldX(x);
            const worldY = this.map.tileToWorldY(y);
            this.fovGraphics.strokeRect(worldX, worldY, this.map.tileWidth, this.map.tileHeight);
        });
    }

    checkTransparency(x, y) {
        const wallTile = this.scene.wallLayer.getTileAt(x, y);
        if (wallTile) {
            return false; // Treat walls as opaque
        }

        const groundTile = this.scene.groundLayer.getTileAt(x, y);
        return groundTile && groundTile.index !== -1; // Example condition, adjust as needed
    }

    update() {
        this.movingFrequency++;
        this.updateFOV(5);
    }
}
