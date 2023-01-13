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
      frames: anims.generateFrameNumbers("player", { start: 4, end: 6 }),
      frameRate: 12,
      repeat: -1
    });
    anims.create({
      key: "player-attack",
      frames: anims.generateFrameNumbers("player", { start: 12, end: 14 }),
      frameRate: 22,
      repeat: 0
    });
    anims.create({
      key: "player-roll",
      frames: anims.generateFrameNumbers("player", { start: 16, end: 19 }),
      frameRate: 12,
      repeat: -1
    });
    anims.create({
      key: "player-jump",
      frames: anims.generateFrameNumbers("player", { start: 8, end: 8 }),
      frameRate: 12,
      repeat: 0
    });
    anims.create({
      key: "player-shoot",
      frames: anims.generateFrameNumbers("player", { start: 24, end: 26 }),
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

    this.swordHitBox = this.scene.add.rectangle(x, y, 12, 12, 0xff0000, 0)
    this.scene.physics.add.existing(this.swordHitBox)
    this.swordHitBox.body.setAllowGravity(false)
    this.swordHitBox.body.enable = false


    this.bombHitBoxDown = this.scene.add.rectangle(x, y, 8, 8, 0xff0000, 0)
    this.scene.physics.add.existing(this.bombHitBoxDown)
    this.bombHitBoxDown.body.setAllowGravity(false)
    this.bombHitBoxDown.body.enable = false
    bombRadius.add(this.bombHitBoxDown)

    this.bombHitBoxRight = this.scene.add.rectangle(x, y, 8, 8, 0xff0000, 0)
    this.scene.physics.add.existing(this.bombHitBoxRight)
    this.bombHitBoxRight.body.setAllowGravity(false)
    this.bombHitBoxRight.body.enable = false
    bombRadius.add(this.bombHitBoxRight)

    this.bombHitBoxLeft = this.scene.add.rectangle(x, y, 8, 8, 0xff0000, 0)
    this.scene.physics.add.existing(this.bombHitBoxLeft)
    this.bombHitBoxLeft.body.setAllowGravity(false)
    this.bombHitBoxLeft.body.enable = false
    bombRadius.add(this.bombHitBoxLeft)

    this.bombHitBoxUp = this.scene.add.rectangle(x, y, 8, 8, 0xff0000, 0)
    this.scene.physics.add.existing(this.bombHitBoxUp)
    this.bombHitBoxUp.body.setAllowGravity(false)
    this.bombHitBoxUp.body.enable = false
    bombRadius.add(this.bombHitBoxUp)

    this.invulnerable = false;

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
    //this.weapon = 'gun'
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
    this.bombHitBoxDown.x = bomb.x
    this.bombHitBoxDown.y = bomb.y + 20

    this.bombHitBoxRight.x = bomb.x + 12
    this.bombHitBoxRight.y = bomb.y + 10

    this.bombHitBoxLeft.x = bomb.x - 12
    this.bombHitBoxLeft.y = bomb.y + 10

    this.bombHitBoxUp.x = bomb.x
    this.bombHitBoxUp.y = bomb.y

    this.bombSet = false
    bombRadius.getChildren().forEach(function (bomb) {
      bomb.body.enable = true
    }, this)
    bomb.setActive(false);
    bomb.setVisible(false);

    var timer = this.scene.time.delayedCall(500, function () {
      bombRadius.getChildren().forEach(function (bombhit) {
        bombhit.body.enable = false
      }, this)
    }, null, this);
    //check if player is over bomb and jump hero
    if (Math.abs(bomb.x - this.sprite.x) <= 16 && Math.abs(bomb.y - this.sprite.y) < 10) {
      this.sprite.body.velocity.y = -jumpVelocity;
    }

  }
  smash() {
    //break boxes
    this.swordHitBox.body.enable = true
    var off = this.sprite.flipX ? -12 : 12
    this.swordHitBox.x = this.sprite.x + off
    this.swordHitBox.y = this.sprite.y



  }
  shoot() {

    if (bullets.maxSize - bullets.getTotalUsed() > 0) {
      if (this.canShoot) {
        this.canShoot = false
        var bullet = bullets.get().setActive(true);

        console.log('shoot')
        // Place the explosion on the screen, and play the animation.
        bullet.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
        bullet.setSize(8, 16).setOffset(8, 4)
        bullet.x = this.sprite.x;
        bullet.y = this.sprite.y - 5;
        bullet.play('bullet-fired')
        if (this.sprite.flipX) {
          bullet.body.setVelocityX(-bulletSpeed)
        } else {
          bullet.body.setVelocityX(bulletSpeed)
        }
        var timer = this.scene.time.delayedCall(150, function () {
          this.canShoot = true
        }, null, this);
        var timer2 = this.scene.time.delayedCall(300, this.killBullet, [bullet], this);
      }

    }
  }
  killBullet(bullet) {
    bullets.killAndHide(bullet)
    bullet.setPosition(-50, -50)
  }
  playerHit(player, spike) {

    //if you are not already invulnerable
    if (!this.invulnerable && !this.invincible) {
      //set player as invulnerable
      this.invulnerable = true;
      //get the heart sprites from our arrays we set up earlier



      //remove a heart from out count stored on the player object
      playerData.health -= 10;
      this.scene.addScore()
      //if hearts is 0 or less you're dead as you are out of lives
      if (playerData.health <= 0) {
        //remove physics from player
        this.sprite.disableBody(false, false);
        //and play death animation
        var tween = this.scene.tweens.add({
          targets: this.sprite,
          alpha: 0.3,
          scaleX: 1.1,
          scaleY: 1.1,
          angle: 90,
          x: this.sprite.x - 20,
          y: this.sprite.y - 20,
          ease: 'Linear',
          duration: 1000,
          onComplete: function () {
            //restartGame(this);
            this.scene.scene.stop()
            this.scene.scene.stop('UI')
            this.scene.scene.start('startGame')
          },
          onCompleteScope: this
        });
      }
      //otherwise you're not dead you've just lost a life so...
      else {
        //make the player stop in their tracks and jump up
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = -220;
        //tween the players alpha to 30%
        var tween = this.scene.tweens.add({
          targets: this.sprite,
          alpha: 0.3,
          ease: 'Linear',
          duration: 200,
          onCompleteScope: this
        });

        //set a timer for 1 second. When this is up we tween player back to normal and make then vulnerable again
        var timer = this.scene.time.delayedCall(1000, this.playerVulnerable, null, this);
      }
    }
  }
  playerVulnerable() {
    //tween player back to 100% opacity and reset invulnerability flag
    var death = this.scene.tweens.add({
      targets: this.sprite,
      alpha: 1,
      ease: 'Linear',
      duration: 200,
      onComplete: function () {
        this.invulnerable = false;
      },
      onCompleteScope: this
    });
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
