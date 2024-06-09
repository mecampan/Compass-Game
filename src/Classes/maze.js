// maze.js
// I want the program to randomly generate a maze but it doesn't seem to be working.
class MazeGenerator {
    constructor(mazeWidth, mazeHeight, startX, startY, endX, endY, wallTileID, map, layer, tileset) {
        this.mazeWidth = mazeWidth;
        this.mazeHeight = mazeHeight;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.wallTileID = wallTileID;
        this.map = map;
        this.layer = layer;
        this.tileset = tileset;
        this.tileSize = this.map.tileWidth; // Assuming square tiles

        this.maze = this.generateMaze();
    }

    generateMaze() {
        console.log('Generating maze...');
        const maze = Array.from({ length: this.mazeHeight }, () => Array(this.mazeWidth).fill(1));
        const stack = [];
        const dirs = [
            { x: 0, y: -1 }, // up
            { x: 1, y: 0 },  // right
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }  // left
        ];

        const isInBounds = (x, y) => x >= 0 && x < this.mazeWidth && y >= 0 && y < this.mazeHeight;

        const carvePassagesFrom = (cx, cy) => {
            stack.push({ x: cx, y: cy });

            while (stack.length > 0) {
                const current = stack[stack.length - 1];
                const { x, y } = current;

                maze[y][x] = 0;

                const neighbors = dirs
                    .map(dir => ({ x: x + dir.x * 2, y: y + dir.y * 2, dir }))
                    .filter(({ x, y }) => isInBounds(x, y) && maze[y][x] === 1);

                if (neighbors.length > 0) {
                    const next = Phaser.Utils.Array.RemoveRandomElement(neighbors);
                    const nx = next.x;
                    const ny = next.y;
                    const mx = x + next.dir.x;
                    const my = y + next.dir.y;

                    maze[my][mx] = 0;
                    maze[ny][nx] = 0;

                    stack.push({ x: nx, y: ny });
                } else {
                    stack.pop();
                }
            }
        };

        carvePassagesFrom(1, 1);

        console.log('Maze generated:', maze);
        return maze;
    }

    applyMaze() {
        console.log('Applying maze...');
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                const tileID = this.maze[y][x] === 1 ? this.wallTileID : -1;
                const tileX = this.startX + x;
                const tileY = this.startY + y;
                const worldCoords = this.map.tileToWorldXY(tileX, tileY);
                if (tileID === this.wallTileID) {
                    this.map.putTileAt(tileID, worldCoords.x, worldCoords.y, false, this.layer);
                    this.layer.setVisible(true);
                }
                console.log(`Setting tile at (${worldCoords.x}, ${worldCoords.y}) to ${tileID}`);
            }
        }
        console.log('Maze applied.');
    }
}
