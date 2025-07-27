import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 650,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: false }
  },
  scene: [GameScene],
  parent: 'game-wrapper' // Add this line to mount canvas in #game-wrapper
};

let game = null;

document.getElementById('start-button').addEventListener('click', () => {
  const audioChoice = document.querySelector('input[name="audio"]:checked');
  if (audioChoice) {
    document.getElementById('audio-popup').style.display = 'none';
    game = new Phaser.Game(config);
    game.audioEnabled = audioChoice.value === 'yes';
  } else {
    alert('Please select an audio option.');
  }
});
