export function spawnEnemies(scene, platforms, level = 1) {
  const group = scene.physics.add.group();
  let positions, speed, chaseRange;
  
  if (level === 1) {
    // Level 1: first enemy on first platform, second enemy on third platform
    positions = [
      { x: 700, y: 450, direction: -1 },  // First enemy on first platform, moving left
      { x: 500, y: 300, direction: -1 }  // Second enemy on third platform
    ];
    speed = 100;
    chaseRange = 200;
  } else {
    // Level 2+: 3 enemies - first platform, third platform, and top platform
    positions = [
      { x: 700, y: 450, direction: -1 },  // First enemy on first platform
      { x: 500, y: 300, direction: -1 },  // Second enemy on third platform
      { x: 400, y: 200, direction: 1 }    // Third enemy on top platform
    ];
    speed = 100 + 20 * (level - 1);
    chaseRange = 200 + 50 * (level - 1);
  }
  
  positions.forEach(pos => {
    const e = group.create(pos.x, pos.y - 30, 'enemy');
    e.setBounce(0.2).setCollideWorldBounds(true).setVelocityX(speed * pos.direction);
    e.direction = pos.direction;
    e.baseSpeed = speed;
  });
  
  scene.anims.create({
    key: 'enemy-left',
    frames: scene.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: 'enemy-right',
    frames: scene.anims.generateFrameNumbers('enemy', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  
  scene.physics.add.collider(group, platforms);
  group.baseSpeed = speed;
  group.chaseRange = chaseRange;
  return group;
}

export function updateEnemyAI(group, player, speed = null, chase = null) {
  // Use group.baseSpeed if speed not provided
  speed = speed || group.baseSpeed || 100;
  // Use group.chaseRange if chase not provided
  chase = chase || group.chaseRange || 120;
  
  group.children.iterate(enemy => {
    // Turn back if hitting a wall
    if (enemy.body.blocked.left) {
      enemy.direction = 1;
      enemy.setVelocityX(speed);
    } else if (enemy.body.blocked.right) {
      enemy.direction = -1;
      enemy.setVelocityX(-speed);
    }
    
    // Chase player if close
    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
    if (dist < chase) {
      enemy.direction = player.x < enemy.x ? -1 : 1;
      enemy.setVelocityX(speed * enemy.direction);
    }
    
    // Play correct animation
    if (enemy.direction === -1) {
      enemy.anims.play('enemy-left', true);
    } else {
      enemy.anims.play('enemy-right', true);
    }
  });
}
