export function setupHUD(scene) {
  return scene.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: 'white' });
}

export function updateScore(textObj, score) {
  textObj.setText('Score: ' + score);
}

export function showGameOver(scene) {
  scene.physics.pause();
  // Centered Game Over in red
  scene.add.text(400, 250, 'Game Over', {
    fontSize: '48px', fill: 'red', align: 'center'
  }).setOrigin(0.5);
  // Centered instructions in white below
  scene.add.text(400, 320, 'Click or Press any key to Restart', {
    fontSize: '28px', fill: 'white', align: 'center'
  }).setOrigin(0.5);
  scene.input.once('pointerdown', () => scene.scene.restart());
  scene.input.keyboard.once('keydown', () => scene.scene.restart());
}

export function showNextLevel(scene) {
  scene.physics.pause();
  // Centered Level Complete in green
  scene.add.text(400, 250, 'Level Complete!', {
    fontSize: '48px', fill: '#00ff00', fontStyle: 'bold', align: 'center'
  }).setOrigin(0.5);
  // Centered instructions in white below
  scene.add.text(400, 320, 'Click or Press any key to Continue', {
    fontSize: '28px', fill: 'white', align: 'center'
  }).setOrigin(0.5);
  
  const nextLevel = () => {
    scene.level += 1;
    scene.scene.restart({ level: scene.level });
  };
  
  scene.input.once('pointerdown', nextLevel);
  scene.input.keyboard.once('keydown', nextLevel);
}
