import 'phaser';

export default class Demo extends Phaser.Scene
{
    origDragPoint = null;

    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.setPath('assets');

        // Load our character model
        this.load.spritesheet([
            { key: 'android', frameConfig: { frameWidth: 32, frameHeight: 48 } },
            { key: 'injured-character', frameConfig: { frameWidth: 48, frameHeight: 32 } }
        ]);

        // Load our tiles
        this.load.image("tiles", "tileset.png");
        this.load.tilemapTiledJSON("map", "map.json");

    }

    create ()
    {

        // Create tilemap
        const map = this.make.tilemap({key: "map"});
        const tileset = map.addTilesetImage("SpaceTiles", "tiles");

        const backgroundLayer = map.createStaticLayer("Background", tileset, 0, 0);
        const foregroundLayer = map.createStaticLayer("Foreground", tileset, 0, 0);


        // Create animations for our character
        var frontWalkConfig = {
            key: 'walkFront',
            frames: this.anims.generateFrameNumbers('android', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1,
            yoyo: false
        };
        var rightWalkConfig = {
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('android', { start: 4, end: 5 }),
            frameRate: 8,
            repeat: -1,
            yoyo: false
        };
        var backWalkConfig = {
            key: 'walkBack',
            frames: this.anims.generateFrameNumbers('android', { start: 6, end: 9 }),
            frameRate: 8,
            repeat: -1,
            yoyo: false
        };
        var leftWalkConfig = {
            key: 'walkLeft',
            frames: this.anims.generateFrameNumbers('android', { start: 10, end: 11 }),
            frameRate: 8,
            repeat: -1,
            yoyo: false
        };
    
        this.anims.create(frontWalkConfig);
        this.anims.create(rightWalkConfig);
        this.anims.create(backWalkConfig);
        this.anims.create(leftWalkConfig);
    
        this.add.sprite(400, 300, 'android').play('walkBack');


    }

    update()
    {
        // Support camera dragging
        if (this.input.activePointer.isDown) {
            if (this.origDragPoint) {
              // move the camera by the amount the mouse has moved since last update
              this.cameras.main.scrollX +=
                this.origDragPoint.x - this.game.input.activePointer.position.x;
              this.cameras.main.scrollY +=
                this.origDragPoint.y - this.game.input.activePointer.position.y;
            } // set new drag origin to current position
            this.origDragPoint = this.game.input.activePointer.position.clone();
          } else {
            this.origDragPoint = null;
          }
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#111217',
    width: 800,
    height: 600,
    scene: Demo
};

const game = new Phaser.Game(config);
