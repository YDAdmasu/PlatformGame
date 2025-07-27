export function setupAudio(scene) {
  if (scene.sound && scene.sys.game.audioEnabled) {
    if (!scene.bgMusic) {
      scene.bgMusic = scene.sound.add('bgMusic', { loop: true, volume: 0.5 });
      scene.bgMusic.play();
    }
  }
}

export function playSound(scene, key) {
  if (scene.sys.game.audioEnabled) scene.sound.play(key);
}

export function stopBgMusic(scene) {
  if (scene.bgMusic) {
    scene.bgMusic.stop();
    scene.bgMusic = null;
  }
}
