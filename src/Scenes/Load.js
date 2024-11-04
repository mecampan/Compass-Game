// Global variables
loadAnim = false;
minimapCreated = false;
class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        //this.load.audio("ui_sound", "audio/UI_click.wav");
        //this.load.audio("item_pickup_sfx", "audio/item_pickup.ogg");
        //this.load.audio("walk_sfx", "audio/16_human_walk_stone_3.wav");
        //this.load.audio("background_music", "audio/myst_on_the_moor.ogg");

        this.load.image("compass_image", "images/compass_image.png");

        this.load.image("compass_needle_image", "images/compass_needle_image.png");

        //load bitmap:
        this.load.bitmapFont("myFont", "font_2.png", "font_2.xml");

        // Load tilemap information
        this.load.image("tileset", "grasslands_tiles/Pack content/Sprites/Tileset/spr_grass_tileset.png");
        this.load.tilemapTiledJSON("forrest_map", "forrest_map.tmj");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "grasslands_tiles/Pack content/Sprites/Tileset/spr_grass_tileset.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.atlasXML('player', 'player.png', 'player.xml');
    }

    create() {
        //backgroundMusic = this.sound.add('background_music', { loop: true });
        //backgroundMusic.play();

        this.scene.start("titleScreenScene");
    }
}