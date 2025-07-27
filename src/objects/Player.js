export default class Player {
  constructor(scene) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(100, 450, 'dude');
    this.sprite.setBounce(0.1).setCollideWorldBounds(true);

    scene.anims.create({
      key: 'left', frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10, repeat: -1
    });
    scene.anims.create({
      key: 'turn', frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    });
    scene.anims.create({
      key: 'right', frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10, repeat: -1
    });
  }
}
