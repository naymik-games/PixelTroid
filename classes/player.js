class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create the animations we need from the player spritesheet
    const anims = scene.anims;
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: "player-run",
      frames: anims.generateFrameNumbers("player", { start: 5, end: 7 }),
      frameRate: 12,
      repeat: -1
    });
    anims.create({
      key: "player-attack",
      frames: anims.generateFrameNumbers("player", { start: 15, end: 18 }),
      frameRate: 22,
      repeat: 0
    });
    anims.create({
      key: "player-roll",
      frames: anims.generateFrameNumbers("player", { start: 20, end: 23 }),
      frameRate: 12,
      repeat: -1
    });
    anims.create({
      key: "player-jump",
      frames: anims.generateFrameNumbers("player", { start: 10, end: 11 }),
      frameRate: 12,
      repeat: 0
    });
    anims.create({
      key: "player-shoot",
      frames: anims.generateFrameNumbers("player", { start: 30, end: 32 }),
      frameRate: 12,
      repeat: 0
    });
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "player", 0)
      .setScale(1)
      .setDrag(3000, 0)
      .setMaxVelocity(150, 400)

    this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset);//15,15 24.5, 17
    this.invulnerable = false;
    this.health = 100
    this.coinCount = 0
    this.dpad = {}
    this.dpad.isUp = false
    this.dpad.isDown = false
    this.dpad.isLeft = false
    this.dpad.isRight = false
    this.dpad.isLeft = false
    this.dpad.isA = false
    this.dpad.isB = false
    this.dpad.isY = false
    this.isAttack = false
    this.roll = false
    this.bombSet = false
    this.weapon = 'gun'
    this.canShoot = true
    this.isJumping = false
    this.invincible = false
    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, DOWN, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      w: W,
      a: A,
      d: D
    });
  }

  update() {
    /* const keys = this.keys;
    const dpad = this.dpad
    //const isAttack = this.isAttack
    const sprite = this.sprite;
    const onGround = sprite.body.blocked.down;
    const acceleration = onGround ? groundAcceleration : 300;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.down.isDown || dpad.isB) {// || dpad.isDown
      this.roll = true
      if (sprite.flipX) {
        sprite.setAccelerationX(-acceleration);
      } else {
        sprite.setAccelerationX(acceleration);
      }
    } else if (keys.left.isDown || keys.a.isDown || dpad.isLeft) {
      sprite.setAccelerationX(-acceleration);
      sprite.setFlipX(true);
    } else if (keys.right.isDown || keys.d.isDown || dpad.isRight) {
      sprite.setAccelerationX(acceleration);
      sprite.setFlipX(false);
    } else {
      sprite.setAccelerationX(0);
      this.roll = false

    }


    var d = new Date();
    var time = d.getTime();

    //if we have just left the ground set edge time for 100ms time
    if (!onGround && wasStanding) {
      edgeTimer = time + 100;
    }



    // Only allow the player to jump if they are on the ground
    if ((standing || time <= edgeTimer) && (keys.up.isDown || keys.w.isDown || dpad.isY) && !this.isJumping) {// || dpad.isUp
      sprite.setVelocityY(-jumpAcceleration);
      this.isJumping = true
    } else if (!keys.up.isDown && !keys.w.isDown && !dpad.isY) {
      if (onGround) {
        this.isJumping = false
      }
    }

    // Update the animation/texture based on the state of the player
    if (this.isAttack) {
      sprite.anims.play("player-attack", true).once('animationcomplete', function () {
        sprite.anims.stop();
        this.isAttack = false
      }, this)

    } else if (standing) {
      if (sprite.body.velocity.x !== 0) {
        if (this.roll) {
          sprite.anims.play("player-roll", true);
        } else {
          sprite.anims.play("player-run", true);
        }

      } else {
        if (!onGround) {
          sprite.anims.play("player-jump", true);
        } else {
          sprite.anims.play("player-idle", true);
        }


      }

    } else {
      // sprite.anims.stop();
      // sprite.setTexture("player", 0);
    } */



  }
  doAction() {

    if (this.roll) {
      if (!this.bombSet) {
        this.bombSet = true
        this.setBomb()
      }

    } else {
      this.smash()
    }
  }
  setBomb() {
    console.log('set bomb')

    var bomb = bombs.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    bomb.setOrigin(0.5, 0).setScale(1).setDepth(3).setVisible(true);
    bomb.x = this.sprite.x;
    bomb.y = this.sprite.y;
    // this.sprite.body.velocity.y = -220;

    bomb.getBounds()

    var timer = this.scene.time.delayedCall(1000, this.explodeBomb, [bomb], this);
  }
  explodeBomb(bomb) {
    this.scene.explode(bomb.x, bomb.y)
    this.bombSet = false
    bomb.setActive(false);
    bomb.setVisible(false);
    //check if player is over bomb and jump hero
    if (Math.abs(bomb.x - this.sprite.x) <= 16 && Math.abs(bomb.y - this.sprite.y) < 10) {
      this.sprite.body.velocity.y = -jumpVelocity;
    }
    //check if box
    boxes.getChildren().forEach(function (box) {
      //check if it's time for them to turn around boxy - bomby < 16.5
      if (Math.abs(bomb.x - box.x) <= 16 && Math.abs(bomb.y - box.y) < 33) { //
        // console.log(bomb.getBounds())
        //  console.log(box.getBounds())
        console.log('Smash!')
        //box.disableBody(false, false);
        this.scene.explode(box.x, box.y)
        //tween coin to score coin in corner shrink
        var tween = this.scene.tweens.add({
          targets: box,
          alpha: 0.3,
          //angle: 720,
          //x: scoreCoin.x,
          //  y: '-=50',
          //scaleX: 0.5,
          // scaleY: 0.5,
          ease: "Linear",
          duration: 250,
          onComplete: function () {
            destroyGameObject(box);
          }
        }, this);
      }

    }, this);

    //kill enemy
    enemies.getChildren().forEach(function (bad) {
      //check if it's time for them to turn around
      if (Math.abs(bomb.x - bad.x) <= 32 && Math.abs(bomb.y - bad.y) < 10) {
        if (!bad.hit) {
          // set baddie as being hit and remove physics
          bad.hit = true
          bad.disableBody(false, false);
          //make player jump up in the air a little bit


          //animate baddie, fading out and getting bigger
          var tween = this.scene.tweens.add({
            targets: bad,
            alpha: 0.3,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Linear',
            duration: 200,
            // onCompleteScope: this,
            onComplete: function () {
              //remove the game object
              destroyGameObject(bad);
            },
          });
        }
      }

    }, this);



  }
  smash() {
    //break boxes
    boxes.getChildren().forEach(function (box) {
      //check if it's time for them to turn around
      if (Math.abs(this.sprite.x - box.x) <= 16 && this.correctSide(box) && Math.abs(this.sprite.body.center.y - box.y) < 10) {
        console.log('Smash!')
        //box.disableBody(false, false);
        this.scene.explode(box.x, box.y)
        //tween coin to score coin in corner shrink
        var tween = this.scene.tweens.add({
          targets: box,
          alpha: 0.3,
          //angle: 720,
          //x: scoreCoin.x,
          //  y: '-=50',
          //scaleX: 0.5,
          // scaleY: 0.5,
          ease: "Linear",
          duration: 250,
          onComplete: function () {
            destroyGameObject(box);
          }
        }, this);
      }

    }, this);

    //kill enemy
    enemies.getChildren().forEach(function (bad) {
      //check if it's time for them to turn around
      if (Math.abs(this.sprite.x - bad.x) <= 32 && this.correctSide(bad) && Math.abs(this.sprite.body.center.y - bad.y) < 10) {
        if (!bad.hit) {
          // set baddie as being hit and remove physics
          bad.hit = true
          bad.disableBody(false, false);
          //make player jump up in the air a little bit
          this.scene.explode(bad.x, bad.y)

          //animate baddie, fading out and getting bigger
          var tween = this.scene.tweens.add({
            targets: bad,
            alpha: 0.3,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Linear',
            duration: 200,
            // onCompleteScope: this,
            onComplete: function () {
              //remove the game object
              destroyGameObject(bad);
            },
          });
        }
      }

    }, this);


  }
  shoot() {

    if (bullets.maxSize - bullets.getTotalUsed() > 0) {
      if (this.canShoot) {
        this.canShoot = false
        var bullet = bullets.get().setActive(true);

        console.log('shoot')
        // Place the explosion on the screen, and play the animation.
        bullet.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
        bullet.setSize(8, 8).setOffset(8, 4)
        bullet.x = this.sprite.x;
        bullet.y = this.sprite.y + 7;
        bullet.play('bullet-fired')
        if (this.sprite.flipX) {
          bullet.body.setVelocityX(-bulletSpeed)
        } else {
          bullet.body.setVelocityX(bulletSpeed)
        }
        var timer = this.scene.time.delayedCall(250, function () {
          this.canShoot = true
        }, null, this);
        var timer2 = this.scene.time.delayedCall(500, this.killBullet, [bullet], this);
      }

    }
  }
  killBullet(bullet) {
    bullets.killAndHide(bullet)
    bullet.setPosition(-50, -50)
  }
  correctSide(box) {
    if (this.sprite.flipX) {
      if (this.sprite.x > box.x) {
        return true
      } else {
        return false
      }
    } else {
      if (this.sprite.x < box.x) {
        return true
      } else {
        return false
      }
    }
  }
  destroy() {
    this.sprite.destroy();
  }
}
