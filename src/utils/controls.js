import { playSound } from './audio.js';

export function setupControls(scene) {
  scene.cursors = scene.input.keyboard.createCursorKeys();
}

export function handleMovement(player, cursors) {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }
}

export function handleJump(player) {
  if (player.body.touching.down && Phaser.Input.Keyboard.JustDown(player.scene.cursors.up)) {
    player.setVelocityY(-380);
    playSound(player.scene, 'jump');
  }
}
