import 'phaser';
import { LEFT } from 'phaser';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class Demo extends Phaser.Scene
{
    origDragPoint = null;
    print = null;

    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.setPath('assets');

        // Load our RexUI scene plugin
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

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
        // UI Stuff for the pop-up menu
        this.print = this.add.text(0, 580, 'Click to pop-up menu').setScrollFactor(0);
        var items = [
            { name: 'Go Here' },
            { name: 'Acquire Trauma Kit' },
        ]
        var scene: any = this;
        //var scene = this,
        var menu = undefined;

        // UI stuff for the pane
        var data = [
            { name: '0:05 - Walk to Trauma Kit' },
            { name: '0:10 - Acquire Trauma Kit' },
            { name: '0:15 - Walk to Patient' },
            { name: '0:20 - Stabilize Patient' },
            { name: '0:45 - Walk to Power Station' },
            { name: '1:45 - Charge Cell' },
            { name: '2:00 - Finish Charging Cell' }
        ];

        // Create tilemap
        const map = this.make.tilemap({key: "map"});
        const tileset = map.addTilesetImage("SpaceTiles", "tiles");

        const backgroundLayer = map.createStaticLayer("Background", tileset, 0, 0);
        const foregroundLayer = map.createDynamicLayer("Foreground", tileset, 0, 0);


        // Handle clicks for the menu
        this.print = this.add.text(0, 0, '').setScrollFactor(0);
        this.input.on('pointerdown', function (pointer) {

            var worldXY = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
            console.log('World poisition at Main: ' + pointer.worldX + ',' + pointer.worldY);
            console.log('World poisition at Sub: ' + worldXY.x + ',' + worldXY.y);

            //foregroundLayer.getTileAtWorldXY(worldXY.x, worldXY.y)?.setAlpha(0);

            if (menu === undefined) {
                menu = createMenu(scene, worldXY.x, worldXY.y, items, function (button) {
                    scene.print.text += 'Click ' + button.text + '\n';
                });
                
            } else if (!menu.isInTouching(worldXY)) {
                menu.collapse();
                menu = undefined;
                scene.print.text = '';
            }
        }, this);

        // Create scrollable panes
        var scrollablePanel = scene.rexUI.add.scrollablePanel({
            x: 400,
            y: 300,
            width: 400,
            height: 220,

            scrollMode: 0,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: createPanel(this, data),

                mask: {
                    padding: 1
                },
            },

            slider: {
                track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },
      
            // scroller: true,

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
            }
        })
        .layout()

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
    
        // Add our test player
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

// Code for creating the side-pane

var createPanel = function (scene, data) {
    var sizer = scene.rexUI.add.sizer({
            orientation: 'y',
        })
        .add(
            createTable(scene, data, 'actions', 1), // child
            0, // proportion
            'top', // align
            {
                right: 8,
            }, // paddingConfig
            true // expand
        )
    return sizer;
}

var createTable = function (scene, data, key, rows) {
    var title = scene.rexUI.add.label({
        orientation: 'y',
        text: scene.add.text(0, 0, 'Actions'),
    });

    var items = data;
    
    var table = scene.rexUI.add.gridSizer({
        column: 1,
        row: items.length,
    });

    var item, r, c;
    var iconSize = (rows === 1) ? 80 : 40;
    for (var i = 0, cnt = items.length; i < cnt; i++) {
        item = items[i];
        r = i % rows;
        c = (i - r) / rows;
        item.category = key;
        table.add(
            createIcon(scene, item, iconSize, iconSize),
            c,
            r,
            'top',
            2,
            true
        );
        delete item.category;
    }

    return scene.rexUI.add.sizer({
            orientation: 'y',
        })
        .addBackground(
            scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1)
        )
        .add(
            title, // child
            0, // proportion
            'left', // align
            5, // paddingConfig
            true // expand
        )
        .add(table, // child
            1, // proportion
            'center', // align
            5, // paddingConfig
            true // expand
        );
}

var createIcon = function (scene, item, iconWidth, iconHeight) {
    var label = scene.rexUI.add.label({
        orientation: 'x',
        icon: scene.rexUI.add.roundRectangle(0, 0, iconWidth, iconHeight, 5, COLOR_LIGHT),
        text: scene.add.text(0, 0, item.name),

        space: {
            icon: 10,
        }
    });

    let category = item.category;
    let name = item.name;
    label.getElement('icon')
        .setInteractive()
        .on('pointerdown', function () {
            if (!scene.rexUI.getTopmostSizer(this).isInTouching()) {
                return;
            }
            scene.print.text += `${category}:${name}\n`;
        });

    return label;
};


// Code for creating the pop-up menus
var createMenu = function (scene, x, y, items, onClick) {
    var menu = scene.rexUI.add.menu({
        x: x,
        y: y,
        bounds: new Phaser.Geom.Rectangle(-1000, -1000, 3000, 3000),
        items: items,
        createButtonCallback: function (item, i) {
            return scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),
                text: scene.add.text(0, 0, item.name, {
                    fontSize: '20px'
                }),
                icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    icon: 10
                }
            })
        },

        easeIn: {
            duration: 500,
            orientation: 'y'
        },

        easeOut: {
            duration: 100,
            orientation: 'y'
        },

        // expandEvent: 'button.over'
    });

    menu
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        })
        .on('button.click', function (button) {
            onClick(button);
        })

    return menu;
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#111217',
    width: 1024,
    height: 786,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: Demo
};

const game = new Phaser.Game(config);
