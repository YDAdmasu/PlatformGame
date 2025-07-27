import Player from '../objects/Player.js';
import { spawnEnemies, updateEnemyAI } from '../objects/Enemy.js';
import { createPlatforms, getLevelDifficulty } from '../objects/PlatformManager.js';
import { setupHUD, updateScore, showGameOver, showNextLevel } from '../utils/hud.js';
import { setupControls, handleMovement, handleJump } from '../utils/controls.js';
import { setupAudio, playSound, stopBgMusic } from '../utils/audio.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.level = 1;
  }

  preload() {
    this.load.image('sky', 'assets/images/sky.png');
    this.load.image('ground', 'assets/images/theplatform.png');
    this.load.image('star', 'assets/images/star.png');
    this.load.image('particle', 'assets/particles/particle.png');
    this.load.image('black-particle', 'assets/particles/particle.png'); // Use the same image, but tint for black
    this.load.spritesheet('dude', 'assets/spritesheets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('enemy', 'assets/spritesheets/enemy.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('bgMusic', 'assets/audio/bg-music.wav');
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('coin', 'assets/audio/coin.wav');
    this.load.audio('hit', 'assets/audio/enemyHitSounds.wav');
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.level = this.level || 1;
    this.player = new Player(this);
    this.platforms = createPlatforms(this, this.level);
    this.enemies = spawnEnemies(this, this.platforms, this.level);
    this.stars = this.physics.add.group({ key: 'star', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } });
    this.stars.children.iterate(star => star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)));
    this.debrisGroup = this.add.group();
    this.score = 0;
    this.scoreText = setupHUD(this);
    setupControls(this);
    setupAudio(this);
    this.physics.add.collider(this.player.sprite, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player.sprite, this.stars, (_, star) => {
      star.disableBody(true, true);
      this.score += 10;
      updateScore(this.scoreText, this.score);
      playSound(this, 'coin');
      // Particle burst for star collection
      for (let i = 0; i < 6; i++) {
        const debris = this.add.image(star.x, star.y, 'particle');
        debris.setScale(0.5);
        this.debrisGroup.add(debris);
        const offsetX = Phaser.Math.Between(-30, 30);
        const offsetY = Phaser.Math.Between(-30, 30);
        this.tweens.add({
          targets: debris,
          x: star.x + offsetX,
          y: star.y + offsetY,
          alpha: 0,
          scale: 0,
          duration: 400,
          ease: 'Power1',
          onComplete: () => debris.destroy()
        });
      }
      // Check for level completion
      if (this.stars.countActive(true) === 0) {
        showNextLevel(this);
      }
    });
    this.physics.add.overlap(this.player.sprite, this.enemies, (player, enemy) => {
      playSound(this, 'hit');
      for (let i = 0; i < 6; i++) {
        const debris = this.add.image(enemy.x, enemy.y, 'black-particle');
        debris.setScale(0.5);
        debris.setTint(0x000000);
        this.debrisGroup.add(debris);
        const offsetX = Phaser.Math.Between(-30, 30);
        const offsetY = Phaser.Math.Between(-30, 30);
        this.tweens.add({
          targets: debris,
          x: enemy.x + offsetX,
          y: enemy.y + offsetY,
          alpha: 0,
          scale: 0,
          duration: 400,
          ease: 'Power1',
          onComplete: () => debris.destroy()
        });
      }
      this.player.sprite.setVisible(false);
      this.player.sprite.body.enable = false;
      stopBgMusic(this);
      showGameOver(this);
    });
    // Show audio controls
    const audioControls = document.getElementById('audio-controls');
    const volumeSlider = document.getElementById('volume-slider');
    const playPauseBtn = document.getElementById('play-pause-btn');
    audioControls.style.display = 'block';
    // Set initial volume
    this.sound.volume = volumeSlider.value;
    // Volume slider event
    volumeSlider.oninput = (e) => {
      this.sound.volume = e.target.value;
      if (this.bgMusic) this.bgMusic.setVolume(e.target.value);
    };
    // Play/pause button event
    playPauseBtn.onclick = () => {
      if (this.bgMusic && this.bgMusic.isPlaying) {
        this.bgMusic.pause();
        playPauseBtn.textContent = 'Play';
      } else if (this.bgMusic && this.bgMusic.isPaused) {
        this.bgMusic.resume();
        playPauseBtn.textContent = 'Pause';
      }
    };
    // Update button state if music ends (shouldn't happen with loop, but for safety)
    if (this.bgMusic) {
      this.bgMusic.on('pause', () => playPauseBtn.textContent = 'Play');
      this.bgMusic.on('resume', () => playPauseBtn.textContent = 'Pause');
    }
    // Hide controls on scene shutdown
    this.events.on('shutdown', () => {
      audioControls.style.display = 'none';
    });
  }

  nextLevel() {
    this.level += 1;
    // Fade out, then restart scene with new level
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.restart({ level: this.level });
    });
  }

  init(data) {
    this.level = data.level || 1;
  }

  update() {
    handleMovement(this.player.sprite, this.input.keyboard.createCursorKeys());
    handleJump(this.player.sprite);
    updateEnemyAI(this.enemies, this.player.sprite, this.enemies.baseSpeed, this.enemies.chaseRange);
  }
}
