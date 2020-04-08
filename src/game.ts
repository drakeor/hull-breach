import 'phaser';

export default class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.spritesheet([
            { key: 'android', frameConfig: { frameWidth: 32, frameHeight: 48 } },
            { key: 'injured-character', frameConfig: { frameWidth: 48, frameHeight: 32 } }
        ]);

        this.load.glsl('stars', 'starfields.glsl.js');
    }

    create ()
    {
        this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

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
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: Demo
};

const game = new Phaser.Game(config);
