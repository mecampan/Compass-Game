// Global variables
loadAnim = false;
minimapCreated = false;
class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.audio("ui_sound", "audio/UI_click.wav");
        this.load.audio("oil_refill_sfx", "audio/oil_refill.ogg");
        this.load.audio("item_pickup_sfx", "audio/item_pickup.ogg");
        this.load.audio("game_over_sfx", "audio/game_over.ogg");
        this.load.audio("walk_sfx", "audio/16_human_walk_stone_3.wav");
        this.load.audio("enemy_attack_sfx", "audio/PUNCH_ELECTRIC_HEAVY_05.wav");
        this.load.audio("win_sfx", "audio/Activate Plinth 03.wav");
        this.load.audio("light_sfx", "audio/BLLTRico_Metallic_11.wav");
        this.load.audio("scream_sfx", "audio/painful_scream.ogg");
        this.load.audio("background_music", "audio/myst_on_the_moor.ogg");

        // Load Enemy
        this.load.atlas("evil_wizard", "images/evil_wizard.png", "evil_wizard.json");

        //load bitmap:
        //this.load.bitmapFont("myFont", "gameFontTest.png", "gameFontTest.fnt");
        this.load.bitmapFont("myFont", "font_2.png", "font_2.xml");

        // books:
        this.load.image("spell_book1", "images/spellBook1.png");
        this.load.image("spell_book2", "images/spellBook2.png");
        this.load.image("spell_book3", "images/spellBook3.png");

        // Lantern:
        this.load.image("lantern", "images/lantern.png");
        this.load.image("oilBar", "images/oilBar.png");
        this.load.image("oilBottle", "images/oilBottle.png");

        // Load tilemap information
        this.load.image("tilemap_tiles", "catacombs_tilemap.png");
        this.load.tilemapTiledJSON("dungeon_map", "dungeon_map.tmj");
        //this.load.tilemapTiledJSON("dungeon", "dungeon.tmj");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "catacombs_tilemap.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.atlasXML('player', 'player.png', 'player.xml');
    }

    create() {
        backgroundMusic = this.sound.add('background_music', { loop: true });
        backgroundMusic.play();

        // Create the animation for the evil wizard
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('evil_wizard', {
                prefix: "idle_",
                start: 1,
                end: 8,
                suffix: ".png",
                zeroPad: 2
            }),
            frameRate: 10,
            repeat: -1
        });


        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('evil_wizard', {
                prefix: "run_",
                start: 1,
                end: 8,
                suffix: ".png",
                zeroPad: 2
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attackA',
            frames: this.anims.generateFrameNames('evil_wizard', {
                prefix: "attackA_",
                start: 1,
                end: 8,
                suffix: ".png",
                zeroPad: 2
            }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'attackB',
            frames: this.anims.generateFrameNames('evil_wizard', {
                prefix: "attackB_",
                start: 1,
                end: 8,
                suffix: ".png",
                zeroPad: 2
            }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNames('evil_wizard', {
                prefix: "death_",
                start: 1,
                end: 7,
                suffix: ".png",
                zeroPad: 2
            }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'take_hit',
            frames: [
                { key: 'evil_wizard', frame: 'take_hit_01.png' },
                { key: 'evil_wizard', frame: 'take_hit_02.png' },
                { key: 'evil_wizard', frame: 'take_hit_03.png' }
            ],
            frameRate: 10,
        });

        this.anims.create({
            key: 'stunned',
            frames: [
                { key: 'evil_wizard', frame: 'take_hit_01.png' },
                { key: 'evil_wizard', frame: 'take_hit_02.png' },
                { key: 'evil_wizard', frame: 'take_hit_03.png' }
            ],
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'torchAnimation',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', { frames: [66, 67, 68, 69] }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.start("titleScreenScene");
    }
}