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
        this.calculateFOV(currentX, currentY, radius); // Always recalculate FOV
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

            if (this.movingFrequency % 100 === 0) {
                if (enemy) {
                    if (isInFOV && !enemy.attacking) {
                        enemy.pathfinder.chase();
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

        let HUD = this.scene.get('hudScene');
        console.log(HUD);
        
        let oilAmount = this.scene.get('hudScene').getOilAmount();
        console.log(oilAmount)

        console.log()
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

        this.updateEnemyVisibility(originX, originY, radius);

        if (this.showFOVOutline) {
            this.drawFOVOutline(); // Draw the FOV outline
        }
    }

    updateEnemyVisibility(originX, originY, radius) {
        this.scene.enemies.getChildren().forEach(enemySprite => {
            const enemyTileX = this.map.worldToTileX(enemySprite.x);
            const enemyTileY = this.map.worldToTileY(enemySprite.y);

            let isInFOV = false;
            for (let { x, y } of this.visibleTiles) {
                if (x === enemyTileX && y === enemyTileY) {
                    isInFOV = true;
                    const distance = Phaser.Math.Distance.Between(originX, originY, enemyTileX, enemyTileY);
                    const alpha = 1.8 - (distance / radius);
                    enemySprite.alpha = alpha;
                    break;
                }
            }

            if (!isInFOV) {
                enemySprite.alpha = 0;
            }
        });
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

    clearFOVOutline() {
        this.fovGraphics.clear();
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