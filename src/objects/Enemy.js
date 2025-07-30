export function spawnEnemies(scene, platforms, level = 1) {
  const group = scene.physics.add.group();

  let positions 
  let speed
  let chaseRange;
  
  if (level === 1) {
    positions = [
      { x: 700, y: 450, direction: -1 }, 
      { x: 500, y: 300, direction: -1 }  
    ];
    speed = 100;
    chaseRange = 80;
  } else {
    positions = [
      { x: 700, y: 450, direction: -1 },  
      { x: 500, y: 300, direction: -1 },  
      { x: 400, y: 200, direction: 1 }    
    ];
    speed = 100 + 20 * (level - 1);
    chaseRange = 80 + 50 * (level - 1);
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

export function updateEnemyAI(group, player, speed = null, chase = null,platforms) {
  // Use group.baseSpeed if speed not provided
  speed = speed || group.baseSpeed || 100;
  // Use group.chaseRange if chase not provided
  chase = chase || group.chaseRange || 80;

  group.children.iterate(enemy => {
    // Check if there's a platform ahead and below in the movement direction
    let hasPlatformAhead = false;
    const checkX = enemy.x + (enemy.direction * 30); // 30 pixels ahead in movement direction
    const checkY = enemy.y + (enemy.height / 2) + 10; // Just below the enemy's base

    // Assuming platforms is a group of sprites
    platforms.getChildren().forEach(platform => {
      if (
        platform.body && // Ensure platform has a physics body
        checkX >= platform.body.left &&
        checkX <= platform.body.right &&
        checkY >= platform.body.top &&
        checkY <= platform.body.bottom
      ) {
        hasPlatformAhead = true; // Platform found under the check point
      }
    });

    // If no platform ahead and not blocked by walls, reverse direction
    if (!hasPlatformAhead && !enemy.body.blocked.left && !enemy.body.blocked.right) {
      enemy.direction = -enemy.direction; // Reverse direction
      enemy.setVelocityX(speed * enemy.direction); // Update velocity
    }

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
