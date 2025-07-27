export function createPlatforms(scene) {
  const platforms = scene.physics.add.staticGroup();
  // Always create the ground
  platforms.create(400, 618, 'ground').setScale(2).refreshBody();

  // Same platform layout for all levels
  const platformConfigs = [
    { y: 500, minX: 0, maxX: 350 },
    { y: 400, minX: 400, maxX: 800 },
    { y: 300, minX: 50, maxX: 450 },
    { y: 200, minX: 200, maxX: 600 }
  ];
  platformConfigs.forEach(config => {
    const x = Phaser.Math.Between(config.minX, config.maxX);
    platforms.create(x, config.y, 'ground');
  });
  return platforms;
}
