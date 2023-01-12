let game;



window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 600,
      height: 1100
    },
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1100 },
        debug: false
      }
    },
    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {

    /*   this.load.scenePlugin(
        'PhaserDebugDrawPlugin',
        'https://cdn.jsdelivr.net/npm/phaser-plugin-debug-draw@7.0.0',
        'debugDraw',
        'debugDraw'
      ); */
  }
  create() {

    // this.cameras.main.setBackgroundColor(0xC6EFD8);
    this.cameras.main.setBackgroundColor(rooms[0].background);
    //this.cameras.main.setBackgroundColor(0xAFB0B3);

    this.map = this.make.tilemap({ key: rooms[currentRoom].roomKey });
    this.tiles = this.map.addTilesetImage(rooms[currentRoom].tileFile, rooms[currentRoom].tileKey);

    layer = this.map.createLayer('layer0', this.tiles);

    const layerDec = this.map.createLayer('layer1', this.tiles);

    // const layer2 = map2.createLayer(0, tiles, 0, 0);
    layer.setCollisionByExclusion([-1, questionFrame, collapseFrame, oneWayFrame, spikeFrame, boxFrame, pushableFrame, sparkFrame, beamFrame, reappearFrame, lavaFrame]);
    //create from other layers
    this.createQuestions(layer)
    this.createCollapse(layer)
    this.createOneWay(layer)

    this.createSpikes(layer)
    this.createBoxes(layer)
    this.createLavaLauncher(layer)
    this.createPushable(layer)
    this.createDoors(layerDec)
    this.createSparks(layer)
    this.createBeams(layer)
    this.createReappearingBlocks(layer)
    this.createLava(layer)
    //sparks.playAnimation('layer-spark')


    //anims
    this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameNumbers("coin", {
        start: 0,
        end: 3
      }),
      frameRate: 7,
      //yoyo: true,
      repeat: -1
    });
    this.anims.create({
      key: "bullet-fired",
      frames: this.anims.generateFrameNumbers("bullet", {
        start: 0,
        end: 3
      }),
      frameRate: 12,
      //yoyo: true,
      repeat: -1
    });

    this.anims.create({
      key: 'effect-explode',
      frames: 'explode',
      frameRate: 20,
      repeat: 0
    });

    //Groups
    this.bursts = this.add.group({
      defaultKey: 'explode',
      maxSize: 30
    });
    bombs = this.add.group({
      defaultKey: 'tiles',
      defaultFrame: bombFrame,
      maxSize: 30
    });
    bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 5,
      allowGravity: false,
      immovable: true
    });
    bombRadius = this.physics.add.group({ allowGravity: false, immovable: true });
    powerupGroup = this.physics.add.group({
      defaultKey: 'powerups',
      defaultFrame: 0,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    });
    lavaBall = this.physics.add.group({
      defaultKey: 'tiles',
      defaultFrame: lavaBallFrame,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    });
    pellets = this.physics.add.group({
      defaultKey: 'pellet',
      defaultFrame: 0,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    });

    /* lavaLaunchers = this.physics.add.group({
      defaultKey: 'bullet',
      defaultFrame: lavaLauncherFrame,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    }); */
    //create from object layer

    this.thinglayer = this.map.getObjectLayer('things')['objects'];

    this.createPlayer()

    this.createCoins()
    this.createKeys()
    this.createShells()
    this.createHPlatforms()
    this.createEnemies()


    //camera and cursors

    // console.log(this.anims)
    //  this.cameras.main.setBounds(0, 0, layer.x + layer.width, 0);
    //  this.cameras.main.setViewport(0, 0, 300);
    this.cameras.main.setZoom(2)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, 850);// map.heightInPixels
    this.cameras.main.setViewport(0, 150, game.config.width, game.config.height - 300);
    this.cameras.main.setDeadzone(game.config.width / 4, game.config.height / 4);

    cursors = this.input.keyboard.createCursorKeys();
    this.keyObj = this.input.keyboard.addKey('X');  // Get key object

    //Physics
    //player collide
    this.physics.world.addCollider(this.player.sprite, layer);
    this.physics.world.addCollider(this.player.sprite, boxes);
    this.physics.add.collider(this.player.sprite, hPlatforms);
    this.physics.world.addCollider(this.player.sprite, reappearingBlocks);
    //player collect
    this.physics.add.overlap(this.player.sprite, coins, this.collectObject, null, this);
    this.physics.add.overlap(this.player.sprite, keys, this.collectObject, null, this);
    this.physics.add.overlap(this.player.sprite, pellets, this.collectObject, null, this);
    this.physics.add.overlap(this.player.sprite, powerupGroup, this.collectObject, null, this);
    //player collide with action
    this.physics.add.collider(this.player.sprite, shells, this.shellHit, null, this);
    this.physics.add.collider(this.player.sprite, questions, this.hitQuestionMarkBlock, null, this);
    this.physics.add.collider(this.player.sprite, collapsingPlatforms, this.shakePlatform, this.checkOneWay, this);
    this.physics.add.collider(this.player.sprite, oneWayBlocks, null, this.checkOneWay, this);
    this.physics.add.collider(this.player.sprite, doors, this.hitDoor, null, this);
    this.physics.world.addCollider(this.player.sprite, pushableBlocks, this.pushBlock, null, this);
    //player collide with damage    
    this.physics.add.collider(this.player.sprite, spikes, this.hitObject, null, this);
    this.physics.add.overlap(this.player.sprite, lava, this.hitObject, null, this);
    this.physics.add.collider(this.player.sprite, sparks, this.hitObject, null, this);
    this.physics.add.collider(this.player.sprite, lavaBall, this.playerHitLavaBall, null, this);
    this.physics.add.overlap(this.player.sprite, enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player.sprite, beams, this.hitObject, null, this);
    //player weapons
    this.physics.add.overlap(this.player.swordHitBox, enemies, this.swordHitEnemy, null, this);
    this.physics.add.overlap(this.player.swordHitBox, boxes, this.swordHitBox, null, this);
    this.physics.add.overlap(this.player.swordHitBox, reappearingBlocks, this.bombHitReappear, null, this);

    this.physics.world.addCollider(bombRadius, boxes, this.bombHitBox, null, this);
    this.physics.world.addCollider(bombRadius, enemies, this.bombHitEnemy, null, this);
    this.physics.world.addCollider(bombRadius, reappearingBlocks, this.bombHitReappear, null, this);

    this.physics.world.addCollider(bullets, layer);
    this.physics.world.addCollider(bullets, boxes, this.bulletHitBox, null, this);
    this.physics.world.addCollider(bullets, reappearingBlocks, this.bulletHitReappear, null, this);
    this.physics.world.addCollider(bullets, enemies, this.bulletHitEnemy, null, this);
    //object collide
    this.physics.world.addCollider(shells, layer);
    this.physics.world.addCollider(boxes, layer);
    this.physics.world.addCollider(boxes, boxes);
    this.physics.world.addCollider(boxes, shells);
    this.physics.world.addCollider(spikes, shells);
    this.physics.world.addCollider(enemies, layer);
    this.physics.add.collider(hPlatforms, layer);
    this.physics.add.collider(powerupGroup, layer);
    //object collide with action
    this.physics.world.addCollider(pushableBlocks, pushableBlocks);
    this.physics.world.addCollider(lavaBall, layer, this.lavaHitLayer, null, this);
    this.physics.world.addCollider(pushableBlocks, layer, this.blockHitWall, null, this);
    //enemy collide
    this.physics.world.addCollider(enemies, enemies);
    this.physics.world.addCollider(enemies, collapsingPlatforms);
    this.physics.world.addCollider(enemies, oneWayBlocks);
    this.physics.world.addCollider(enemies, spikes);
    this.physics.world.addCollider(enemies, lava);
    this.physics.world.addCollider(enemies, boxes);



    this.input.addPointer(1);
    this.buildTouchSlider();
    this.canDoubleJump = false


    /*  let graphics = this.add.graphics()
     layer.renderDebug(graphics, {
       tileColor: new Phaser.Display.Color(0, 0, 255, 50), // Non-colliding tiles
       collidingTileColor: new Phaser.Display.Color(0, 255, 0, 100), // Colliding tiles
       faceColor: new Phaser.Display.Color(255, 0, 0, 100) // Colliding face edges
     }); */

  }
  ///update
  update() {
    //built in arcade physics functions of blocked and touching to test for collisions in a given direction
    standing = this.player.sprite.body.blocked.down || this.player.sprite.body.touching.down,
      //get current time in seconds
      d = new Date(),
      time = d.getTime();
    if (this.keyObj.isDown) {
      if (this.player.roll) {
        if (!this.player.bombSet) {
          this.player.bombSet = true
          this.player.setBomb()
        }
      } else {
        this.player.isAttack = true
        if (this.player.weapon == 'sword') {
          this.player.smash()
        } else if (this.player.weapon == 'gun') {
          this.player.shoot()
        }

      }
    }
    //if left key is down then move left
    if (cursors.left.isDown) {
      this.player.sprite.setFlipX(true);
      this.moveLeft(acceleration);
    }
    //same deal but for right arrow
    else if (cursors.right.isDown) {
      this.player.sprite.setFlipX(false);
      this.moveRight(acceleration);
    } else if (cursors.down.isDown) {
      this.player.roll = true
      this.roll()
    }
    //////////////////////////////////////////
    /*     if (Math.abs(baddie.x - baddie.previousX) >= baddie.maxDistance) {
          switchDirection(baddie);
        } */

    //if either touch pointer is down. Two thumbs, two pointers
    if (this.input.pointer1.isDown || this.input.pointer2.isDown) {
      //work out half way point of our game
      var leftHalf = game.config.width;
      var bottomHalf = game.config.height - 125
      //Left hand side - horizontal movement
      //if thumb is on the left hand side of the screen we are dealing with horizontal movement
      if ((this.input.pointer1.x < leftHalf || this.input.pointer2.x < leftHalf) && (this.input.pointer1.y < bottomHalf || this.input.pointer2.y < bottomHalf)) {
        //reset pointer variable
        var myMovePointer = null;
        //here we get the pointer that is being used on the left hand side of screen. Depends which thumb they touched screen with first.
        if ((this.input.pointer1.x < leftHalf && this.input.pointer1.y < bottomHalf) && this.input.pointer1.isDown) {
          myMovePointer = this.input.pointer1;
        }
        if ((this.input.pointer2.x < leftHalf && this.input.pointer2.y < bottomHalf) && this.input.pointer2.isDown) {
          myMovePointer = this.input.pointer2;
        }

        //if we have an active touch pointer on the left hand side of the screen then...
        if (myMovePointer) {
          //if touchSlide is not already showing then
          if (!touchSlider.alpha) {
            //make it visible
            touchSlider.alpha = 1;
            //position touchSlider to be where the users thumb or finger is
            //touchSlider.x = myMovePointer.worldX;
            //with the Y pos we add a thumbSizeOffset so it's above the users thumb not hidden under it
            //touchSlider.y = myMovePointer.y - thumbSizeOffset;
            //set our start point and reset slider display
            startX = myMovePointer.x;
            sliderKnob.x = 0;
          }

          //if thumb has moved left or right of where we started then move
          if (myMovePointer.x < startX || myMovePointer.x > startX) {
            //work out how far thumb has moved. Is this a big enough movement?
            var movement = 0;
            if (myMovePointer.x < startX) movement = startX - myMovePointer.x;
            if (myMovePointer.x > startX) movement = myMovePointer.x - startX;
            //If move is significant enough then move our character
            if (movement > touchMoveThreshold) {
              //set flag as we are definitely moving
              touchMoving = true;
              //set a flag so we know we are on a mobile device
              isTouch = true;

              //set slider knob position to be half way to edge
              var sliderPos = 0;
              //left
              if (myMovePointer.x < startX) sliderPos = -(sliderBar.displayWidth / 4);
              //right
              if (myMovePointer.x > startX) sliderPos = sliderBar.displayWidth / 4;

              //set acceleration to be an 8th of normal
              var tmpAcceleration = acceleration / 8;

              //if thumb has moved quite a lot, then go faster
              if (movement > largeThumbMoveAcross) {
                //the knob position should be at the edge as we're at full tilt
                if (myMovePointer.x < startX) sliderPos = -(sliderBar.displayWidth / 2);
                if (myMovePointer.x > startX) sliderPos = sliderBar.displayWidth / 2;
                //acceleration is normal
                tmpAcceleration = acceleration;
              }

              //tween slider knob to position we just worked out
              var tween = this.tweens.add({
                targets: sliderKnob,
                x: sliderPos,
                ease: "Power1",
                duration: 300
              });
              if (myMovePointer.x < startX) {
                this.player.sprite.setFlipX(true);
                this.moveLeft(tmpAcceleration);
              }
              if (myMovePointer.x > startX) {
                this.player.sprite.setFlipX(false);
                this.moveRight(tmpAcceleration);
              }
            } else {
              //If move is really, really small then we don't count it. Stop moving
              //set moving flag to false
              touchMoving = false;
              //reset slider knob to center position
              var tween = this.tweens.add({
                targets: sliderKnob,
                x: 0,
                ease: "Power1",
                duration: 300
              });
            }
          }
        }
      }

      //Right hand side - Touch Jumping
      //if thumb is on the right hand side of the screen we are dealing with vertical movement - i.e. jumping.
      /* if ((this.input.pointer1.x > leftHalf || this.input.pointer2.x > leftHalf) && (this.input.pointer1.y > bottomHalf || this.input.pointer2.y > bottomHalf) && (this.input.pointer1.y < 150 || this.input.pointer2.y < 150)) {
        //reset pointer variable
        var myJumpPointer = null;

        //get active touch pointer for this side of the screen
        if (this.input.pointer1.x > leftHalf && this.input.pointer1.isDown) {
          myJumpPointer = this.input.pointer1;
        }
        if (this.input.pointer2.x > leftHalf && this.input.pointer2.isDown) {
          myJumpPointer = this.input.pointer2;
        }
        //if we have a touch pointer on right hand side of screen...
        if (myJumpPointer) {
          //store last y position of touch pointer
          //prevPos = yPos;
          //get new position of touch pointer
          var startY = yPos
          yPos = myJumpPointer.y;

          var movementY = 0;
          var up = false
          var down = false
          if (yPos < startY) {
            movementY = startY - yPos;//up
            // console.log('up')
            var up = true
            var down = false
          } else {
            var up = false
            var down = true
          }
          if (yPos > startY) {
            movementY = yPos - startY;//up
          } else {
            movementY = startY - yPos;//down
          }
          //  if we have moved our thump upwards then we set jump flag to true
          if (movementY > touchJumpThreshold && up) {
            console.log('up')
            touchJump = true;
          } else if (movementY > touchJumpThreshold && down) {
            console.log('down')
            this.player.roll = true
            this.roll()
          }
          startY = 0
        }
      } */
      //neither thumb is down so reset touch movement variables and hide touchSlider
    } else {
      touchSlider.alpha = 0;
      startX = 0;
      touchMoving = false;
      //jumps = 2

    }
    //VELOCITY CHECK
    //if not moving left or right via keys or touch device...
    if (!cursors.right.isDown && !cursors.left.isDown && !touchMoving) {
      //if hero is close to having no velocity either left or right then set velocity to 0. This stops jerky back and forth as the hero comes to a halt. i.e. as we slow hero down, below a certain point we just stop them moving altogether as it looks smoother
      if (Math.abs(this.player.sprite.body.velocity.x) < 10 && Math.abs(this.player.sprite.body.velocity.x) > -10) {
        this.player.sprite.setVelocityX(0);
        this.player.sprite.setAccelerationX(0);
      } else {
        //if our hero isn't moving left or right then slow them down
        //this velocity.x check just works out whether we are setting a positive (going right) or negative (going left) number
        this.player.sprite.setAccelerationX(
          (this.player.sprite.body.velocity.x > 0 ? -1 : 1) * acceleration / 2.5
        );
      }
    }

    //get current time in seconds
    var d = new Date();
    var time = d.getTime();

    //if we have just left the ground set edge time for 100ms time
    if (!standing && wasStanding) {
      edgeTimer = time + 100;
    }




    if ((standing || time <= edgeTimer || jumps > 0) && (cursors.up.isDown || touchJump || this.player.dpad.isY) && !jumping) {
      if (standing) {
        jumping = true;
        this.player.roll = false
        this.player.sprite.body.setVelocityY(-jumpVelocity);
        this.player.dpad.isY = false
        jumps--
      } else if (jumps > 0 || this.player.dpad.isY) {
        this.player.sprite.body.setVelocityY(-jumpVelocity);

        jumps--
      } else {
        //jumping = false;
      }


    }



    //RESETS
    //if not pressing up key...
    if (!cursors.up.isDown) {
      //if player is touching ground / platform then reset jump parametrs
      if (standing) {
        jumping = false;
        touchJump = false;
        prevPos = 0;
        jumps = 1
      }

    }
    wasStanding = standing;
    //if player is no longer on on ladder then turn gravity back on
    //   this.player.sprite.body.setAllowGravity(true);

    //ANIMATION
    if (this.player.isAttack && !this.player.roll) {
      if (this.player.weapon == 'sword') {
        this.player.sprite.anims.play("player-attack", true).once('animationcomplete', function () {
          this.player.sprite.anims.stop();
          this.player.swordHitBox.body.enable = false
          this.player.isAttack = false
        }, this)
      } else {
        this.player.sprite.anims.play("player-shoot", true).once('animationcomplete', function () {
          this.player.sprite.anims.stop();
          this.player.isAttack = false
        }, this)
      }


    } else if (standing) {
      if (this.player.sprite.body.velocity.x !== 0) {
        if (this.player.roll) {
          this.player.sprite.anims.play("player-roll", true);
          this.player.sprite.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
        } else if (this.player.sprite.body.velocity.y < 0) {
          this.player.sprite.anims.play("player-jump", true);
          this.player.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        } else {
          this.player.sprite.anims.play("player-run", true);
          this.player.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        }

      } else {
        if (this.player.sprite.body.velocity.y < 0) {
          this.player.sprite.anims.play("player-jump", true);
          this.player.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        } else {
          if (this.player.roll) {
            this.player.sprite.anims.play("player-roll", true);
            this.player.sprite.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
          } else {
            this.player.sprite.anims.play("player-idle", true);
            this.player.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
          }

        }


      }

    } else {
      // sprite.anims.stop();
      // sprite.setTexture("player", 0);
    } //end player move stuff
    //ENEMY MOVMEMENT
    /*  enemies.getChildren().forEach(function (theBaddie) {
       //check if it's time for them to turn around
 
       if (Math.abs(theBaddie.x - theBaddie.previousX) >= theBaddie.maxDistance) {
         theBaddie.toggleFlipX()
         this.switchDirection(theBaddie);
       } else {
         if (theBaddie.direction == -1 && theBaddie.body.blocked.left) {
           // console.log('blocked left')
           theBaddie.setFlipX(false)
           this.switchDirection(theBaddie);
         }
         if (theBaddie.direction == 1 && theBaddie.body.blocked.right) {
           //console.log('blocked right')
           theBaddie.setFlipX(true)
           this.switchDirection(theBaddie);
         }
       }
     }, this); */


  }//end update
  moveLeft(acceleration) {
    var standing = this.player.sprite.body.blocked.down || this.player.sprite.body.touching.down;

    //if hero is on ground then use full acceleration
    if (standing) {
      this.player.sprite.setAccelerationX(-acceleration);

    }
    //if hero is in the air then accelerate slower
    else {
      this.player.sprite.setAccelerationX(-acceleration / 2.5);
    }
  }

  moveRight(acceleration) {
    var standing = this.player.sprite.body.blocked.down || this.player.sprite.body.touching.down;

    //if hero is on ground then use full acceleration
    if (standing) {
      this.player.sprite.setAccelerationX(acceleration);
    }
    //if hero is in the air then accelerate slower
    else {
      this.player.sprite.setAccelerationX(acceleration / 2.5);
    }
  }
  roll() {
    if (standing) {
      //console.log(this.player.sprite.flipX)
      /* if (this.player.sprite.flipX) {
        this.moveLeft(acceleration);
      } else {
        this.moveRight(acceleration);
      } */
      this.player.sprite.anims.play("player-roll", true);
    }
  }
  switchDirection(baddie) {

    //reverse velocity so baddie moves are same speed but in opposite direction
    baddie.body.velocity.x *= -1;
    baddie.direction *= -1
    //reset count
    baddie.previousX = baddie.x;
  }
  //////////////////////////////
  // COLLISION FUNCTIONS
  ////////////////////////////
  shellHit(player, shell) {
    //work out the center point of the shell and player
    var threshold = shell.x + (shell.width / 2),
      playerX = player.x + (player.width / 2);

    //if the player has jumped on top of the shell...
    if (shell.body.touching.up) {
      //if player landed on left hand side of shell send shell off to right
      if (playerX < threshold) {
        shell.setFlipY(false)
        shell.body.velocity.x = shellSpeed;
      } else {
        shell.setFlipY(true)
        shell.body.velocity.x = -shellSpeed;
      }

      //if player landed on right hand side of shell send shell off to left


    }
    //player hit shell from left so send right
    if (shell.body.touching.left) {
      shell.body.velocity.x = shellSpeed;
      shell.setFlipY(false)
    }
    //player hit shell from right so send left
    if (shell.body.touching.right) {
      shell.setFlipY(true)
      shell.body.velocity.x = -shellSpeed;
    }
    //make player react to shell by bouncing slightly
    player.body.velocity.y = -200;
  }
  collectObject(player, gameObject) {
    //stop coin for being collected twice, as it will stick around on the screen as it animnates
    gameObject.disableBody(false, false);
    if (gameObject.type == 'Coin') {
      this.player.coinCount++
      this.updateCoin()
    }
    if (gameObject.type == 'pellet') {
      this.player.health += Phaser.Math.Between(1, 2) == 1 ? 3 : 5
      this.addScore()
    }
    if (gameObject.type == 'Key') {
      this.player.hasKey = true
      this.updateKey()
    }
    if (gameObject.type == 'invincible') {
      console.log('invincible')
      //this.player.hasKey = true
      //this.updateKey()
      this.player.invincible = true
      var t = this.tweens.add({
        targets: this.player.sprite,
        alpha: .2,
        duration: 500,
        repeat: 5,
        yoyo: true,
        onCompleteScope: this,
        onComplete: function () {
          this.player.invincible = false
        }
      })
    }
    //tween coin to score coin in corner shrink
    var tween = this.tweens.add({
      targets: gameObject,
      alpha: 0.3,
      angle: 720,
      //x: scoreCoin.x,
      y: '-=50',
      scaleX: 0.5,
      scaleY: 0.5,
      ease: "Linear",
      duration: 500,
      onComplete: function () {
        destroyGameObject(gameObject);
      }
    });

    //check if we already have an animation
    /* if (scoreCoinTimeline) {
        //if animation isn't currently running, then run again
        if (scoreCoinTimeline.progress == 1) {
            animateScoreCoin(this);
        }
    } else {
        //no animation to create one
        animateScoreCoin(this);
    }
    score += 10;
    scoreText.setText(score); */
  }
  ////////////////////////////////////////////////////
  // WEAPON STUFF
  ////////////////////////////////////////////////////
  swordHitBox(bullet, box) {
    this.player.swordHitBox.body.enable = false
    this.explode(box.x, box.y)
    //tween coin to score coin in corner shrink
    var tween = this.tweens.add({
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
  swordHitEnemy(sword, bad) {
    this.player.swordHitBox.body.enable = false
    if (!bad.hit) {
      // set baddie as being hit and remove physics
      bad.hit = true
      bad.enemyHit(1)
    }
  }
  bulletHitEnemy(bullet, bad) {
    this.player.killBullet(bullet)
    if (!bad.hit) {
      // set baddie as being hit and remove physics
      bad.hit = true
      bad.enemyHit(1)
    }
  }
  bombHitEnemy(bombHit, bad) {

    if (!bad.hit) {
      // set baddie as being hit and remove physics
      bad.hit = true
      bad.enemyHit(1)
    }
  }

  bombHitBox(bombHit, box) {
    this.explode(box.x, box.y)
    //tween coin to score coin in corner shrink
    var tween = this.tweens.add({
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

  bombHitReappear(bombHit, block) {

    //tween coin to score coin in corner shrink
    var tween = this.tweens.add({
      targets: block,
      alpha: 0.2,
      //angle: 720,
      //x: scoreCoin.x,
      //  y: '-=50',
      //scaleX: 0.5,
      // scaleY: 0.5,
      ease: "Linear",
      duration: 250,
      onComplete: function () {
        block.body.enable = false
      }
    }, this);
    var timer = this.time.delayedCall(2000, this.reappearBlock, [block], this);
  }
  bulletHitReappear(bullet, block) {
    this.player.killBullet(bullet)
    var tween = this.tweens.add({
      targets: block,
      alpha: 0.2,
      //angle: 720,
      //x: scoreCoin.x,
      //  y: '-=50',
      //scaleX: 0.5,
      // scaleY: 0.5,
      ease: "Linear",
      duration: 250,
      onComplete: function () {
        block.body.enable = false
      }
    }, this);
    var timer = this.time.delayedCall(2000, this.reappearBlock, [block], this);
  }
  reappearBlock(block) {
    var tween = this.tweens.add({
      targets: block,
      alpha: 1,
      //angle: 720,
      //x: scoreCoin.x,
      //  y: '-=50',
      //scaleX: 0.5,
      // scaleY: 0.5,
      ease: "Linear",
      duration: 250,
      onCompleteScope: this,
      onComplete: function () {
        block.body.enable = true

      }
    }, this);
  }
  bulletHitBox(bullet, box) {
    this.player.killBullet(bullet)
    this.explode(box.x, box.y)
    //tween coin to score coin in corner shrink
    var tween = this.tweens.add({
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
  ////////////////////////////////////////////////////
  // ACTIONS
  ////////////////////////////////////////////////////
  pushBlock(player, block) {
    //block.body.setMaxVelocityX(25);
  }
  blockHitWall(block, layer) {
    if (block.body.blocked.right || block.body.blocked.right) {
      block.body.setImmovable(true)
    }
  }
  hitDoor(player, door) {
    //console.log(door)

    if (this.player.hasKey) {
      player.disableBody(false, false);
      //door.disableBody(false, false);
      this.input.enabled = false
      if (door.direction == 'right') {
        console.log('going right')
        currentRoom = rooms[currentRoom].toID
        door.anims.play('effect-door-right', true).once('animationcomplete', function () {
          this.scene.restart()
          //this.scene.stop()
          //this.scene.stop('UI')
          //this.scene.start('startGame')
        }, this);
      } else {
        door.anims.play('effect-door-left', true).once('animationcomplete', function () {
          console.log('going left')
          currentRoom = rooms[currentRoom].fromID
          this.scene.restart()
          // this.scene.stop()
          //this.scene.stop('UI')
          //this.scene.start('startGame')
        }, this);
      }

      /* var t = this.tweens.add({
        targets: player,
        alpha: .2,
        duration: 1000,
        onCompleteScope: this,
        onComplete: function () {
          this.scene.stop()
          this.scene.stop('UI')
          this.scene.start('startGame')
        }
      }) */
    }

  }
  hitEnemy(player, baddie) {

    this.player.playerHit()

  }
  hitObject(player, object) {
    this.player.playerHit()
  }
  playerHitLavaBall(player, ball) {
    lavaBall.killAndHide(ball)
    ball.setPosition(-50, -50)
    this.player.playerHit(player, ball)
  }


  hitQuestionMarkBlock(player, block) {
    //if the block has been hit from the bottom and is not already hit then...
    if (block.body.touching.down && !block.hit) {
      //mark block as hit
      block.hit = true;
      var powerup = powerupGroup.get().setActive(true);
      powerup.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
      powerup.enableBody = true;
      powerup.x = block.x;
      powerup.y = block.y;
      powerup.type = 'invincible'
      powerup.body.setVelocityY(-300);
      powerup.body.setVelocityX(80)
      /*  if (Math.floor(Math.random() * 1) > .5) powerup.body.setVelocityX(-80);
       else powerup.body.setVelocityX(80); */
      powerup.body.setAllowGravity(true);

      //this.emptyQuestionBlock(powerup)


      // powerup.enableBody = true;
      //animate the rising of the mushroom powerup
      /* var tween = this.tweens.add({
        targets: powerup,
        y: "-=24",
        ease: 'Linear',
        duration: 300,
        onCompleteScope: this,
        onComplete: function () {
          // powerup.enableBody = true;
          //when the animation completes call this function
          //this.emptyQuestionBlock(block, powerup);

        },
      }); */

      //animate the box being hit and jumping up slightly
      var tween = this.tweens.add({
        targets: block,
        y: "-=5",
        ease: 'Linear',
        yoyo: true,
        duration: 100
      });
    }
  }
  emptyQuestionBlock(block, powerup) {
    //change the sprite of the question mark box
    // block.setTexture("empty-box");
    //enable physics on the mushroom powerup
    // powerup.enableBody = true;
    //turn mushroom powerups gravity back on
    powerup.setVelocityX(80)
    //randomly assign left or right direction to the powerup

  }


  lavaHitLayer(ball, layer) {
    lavaBall.killAndHide(ball)
    ball.setPosition(-50, -50)
  }
  shakePlatform(player, platform) {
    //only make platform shake if player is standing on it
    //console.log('shake')
    if (player.body.blocked.down || player.body.touching.down) {
      //do a little camera shake to indicate something bad is going to happen
      this.cameras.main.shake(5, 0.001);
      //we need to store the global scope here so we can keep it later
      var ourScene = this;
      //do a yoyo tween shaking the platform back and forth and up and down
      var tween = this.tweens.add({
        targets: platform,
        yoyo: true,
        repeat: 10,
        x: {
          from: platform.x,
          to: platform.x + 2 * 1,
        },
        ease: 'Linear',
        duration: 50,
        onCompleteScope: this,
        onComplete: function () {
          this.destroyPlatform(platform);
        }
      });
    }
  }
  destroyPlatform(platform) {
    var tween = this.tweens.add({
      targets: platform,
      alpha: 0,
      y: "+=25",
      ease: 'Linear',
      duration: 100,
      onComplete: function () {
        destroyGameObject(platform);
      }
    });
  }
  //////////////////////////////////////////
  // REWARDS
  //////////////////////////////////////////
  addPellet(x, y) {
    var pellet = pellets.get().setActive(true);


    // Place the explosion on the screen, and play the animation.
    pellet.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
    pellet.setSize(8, 8).setOffset(8, 4)
    pellet.type = 'pellet'
    pellet.x = x;
    pellet.y = y;
    var timer = this.time.delayedCall(3000, this.removePellet, [pellet], this);
    //bullet.play('bullet-fired')
  }
  removePellet(pellet) {
    pellet.setActive(false);
    pellet.setVisible(false);
  }
  ///////////////////////////////////////////
  // CREATE FUNCTIONS
  ///////////////////////////////////////////
  createCoins() {
    coins = this.physics.add.group({ allowGravity: false });
    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Coin') {
        //console.log(this.thinglayer[i])
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        var coin = coins.create(worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 'tiles', coinFrame)//99
        coin.type = this.thinglayer[i].name
        coin.setOrigin(.5, .5);
        coin.anims.play('rotate')
      }
    }

  }
  createKeys() {
    keys = this.physics.add.group({ allowGravity: false });
    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Key') {
        console.log(this.thinglayer[i])
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        var key = keys.create(worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 'tiles', keyFrame)//99
        key.type = this.thinglayer[i].name
        key.setOrigin(.5, .5);
      }
    }

  }
  createShells() {
    shells = this.physics.add.group({ allowGravity: true });
    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Shell') {
        console.log(this.thinglayer[i])
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        var shellImg = shells.create(worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 'tiles', shellFrame)//99
        shellImg.type = this.thinglayer[i].name
        shellImg.setOrigin(.5, .5);
        shellImg.setBounce(.5);
      }
    }

  }
  createHPlatforms() {
    hPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Hplatform') {
        console.log(this.thinglayer[i])
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        var plat = hPlatforms.create(worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 'platform')//99
        plat.type = this.thinglayer[i].name
        plat.setOrigin(.5, .5);
        plat.setFriction(1);
        plat.setBounce(1);
        plat.setVelocityX(50);
      }
    }

  }
  createPlayer() {
    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Player') {
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        this.player = new Player(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2))
        this.player.sprite.setPushable(false)
        this.cameras.main.startFollow(this.player.sprite);
      }
    }
  }
  createEnemies() {

    enemies = this.physics.add.group({ immovable: true });
    for (var i = 0; i < this.thinglayer.length; i++) {
      var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
      if (this.thinglayer[i].name == 'Enemy1') {
        var enemey = new Enemy(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 0)
        //console.log('make enemy 1')
      } else if (this.thinglayer[i].name == 'Enemy2') {
        var enemey = new Enemy(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 1)
        // console.log('make enemy 2')
      }
      else if (this.thinglayer[i].name == 'Enemy9') {
        var enemey = new Enemy(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 8)
        // console.log('make enemy 2')
      } else if (this.thinglayer[i].name == 'Enemy4') {
        var enemey = new Enemy(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 3)
        // console.log('make enemy 2')
      }
    }
    console.log(enemies)
  }
  createQuestions(layer) {
    questions = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(questionFrame, 0, { key: 'tiles', frame: questionFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      questions.add(sprites[i])
    }
  }
  createCollapse(layer) {
    collapsingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(collapseFrame, 0, { key: 'tiles', frame: collapseFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      collapsingPlatforms.add(sprites[i])
    }
  }
  createReappearingBlocks(layer) {
    reappearingBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(reappearFrame, 0, { key: 'tiles', frame: reappearFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      reappearingBlocks.add(sprites[i])
    }
  }
  createOneWay(layer) {
    oneWayBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(oneWayFrame, 0, { key: 'tiles', frame: oneWayFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      oneWayBlocks.add(sprites[i])
    }
  }
  createSpikes(layer) {
    spikes = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(spikeFrame, 0, { key: 'tiles', frame: spikeFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      spikes.add(sprites[i])
    }
  }
  createLava(layer) {
    lava = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(lavaFrame, 0, { key: 'tiles', frame: lavaFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      lava.add(sprites[i])
    }
  }
  createSparks(layer) {
    this.anims.create({
      key: "layer-spark",
      frames: this.anims.generateFrameNumbers("tiles", { start: 21, end: 23 }),
      frameRate: 12,
      repeat: -1
    });
    sparks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(sparkFrame, 0, { key: 'tiles', frame: sparkFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].setDepth(3)
      sparks.add(sprites[i])

    }
    //sparks.playAnimation('layer-spark')
    Phaser.Actions.Call(sparks.getChildren(), child => {
      child.body.setSize(12, 8).setOffset(3, 8)
      child.anims.play('layer-spark', true);
    });
  }
  createBeams(layer) {
    this.anims.create({
      key: "layer-beam",
      frames: this.anims.generateFrameNumbers("tiles", { start: 16, end: 17 }),
      frameRate: 8,
      repeat: -1
    });
    beams = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(beamFrame, 0, { key: 'tiles', frame: beamFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].setDepth(3)
      beams.add(sprites[i])

    }
    //sparks.playAnimation('layer-spark')
    Phaser.Actions.Call(beams.getChildren(), child => {
      child.body.setSize(6, 16).setOffset(6, 0)
      child.anims.play('layer-beam', true);
    });
  }
  createDoors(layer) {
    this.anims.create({
      key: 'effect-door-right',
      frames: this.anims.generateFrameNumbers("door", { start: 0, end: 3 }),
      frameRate: 14,
      repeat: 0
    });
    doors = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(doorRFrame, 0, { key: 'door', frame: 0 }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].direction = 'right'
      //  sprites[i].y += (this.map.tileHeight / 2)
      doors.add(sprites[i])
    }
    this.anims.create({
      key: 'effect-door-left',
      frames: this.anims.generateFrameNumbers("door", { start: 4, end: 7 }),
      frameRate: 14,
      repeat: 0
    });
    var sprites = this.map.createFromTiles(doorLFrame, 0, { key: 'door', frame: 4 }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].direction = 'left'
      //  sprites[i].y += (this.map.tileHeight / 2)
      doors.add(sprites[i])
    }
  }
  createBoxes(layer) {
    boxes = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(boxFrame, 0, { key: 'tiles', frame: boxFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      boxes.add(sprites[i])
    }
  }
  createPushable(layer) {
    pushableBlocks = this.physics.add.group({ allowGravity: true, immovable: false, bounce: 0, pushable: true, setDragY: .5 });
    var sprites = this.map.createFromTiles(pushableFrame, 0, { key: 'tiles', frame: pushableFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)

      pushableBlocks.add(sprites[i])
    }
  }
  createLavaLauncher(layer) {
    lavaLaunchers = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(lavaLauncherFrame, 0, { key: 'tiles', frame: lavaLauncherFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      lavaLaunchers.add(sprites[i])
    }
    var launchTimes = [1500, 2000, 2500, 3000]//
    lavaLaunchers.getChildren().forEach(function (box) {
      //box.launcher = this.time.delayedCall(2000, this.launch, [box], this);
      var ranTime = Phaser.Math.Between(0, launchTimes.length - 1)
      box.launcher = this.time.addEvent({
        delay: launchTimes[ranTime],                // ms
        callback: this.launch,
        args: [box],
        callbackScope: this,
        repeat: -1
      });



    }, this);
  }
  launch(box) {
    var t = this.tweens.add({
      targets: box,
      yoyo: true,
      scale: .5,
      //repeat: 10,
      /* x: {
        from: box.x,
        to: box.x + 2 * 1,
      }, */
      ease: 'Linear',
      duration: 50,

    })
    var bomb = lavaBall.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    bomb.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
    bomb.x = box.x;
    bomb.y = box.y;
    bomb.body.velocity.y = 100;
  }
  buildTouchSlider() {
    sliderBar = this.add.sprite(0, 0, 'touch-slider').setScale(1);
    sliderKnob = this.add.sprite(0, 0, 'touch-knob').setScale(1);

    touchSlider = this.add.container(300, 225).setScrollFactor(0);
    touchSlider.add(sliderBar);
    touchSlider.add(sliderKnob);
    touchSlider.alpha = 1;
  }
  ////////////////////////////////////////////////////
  // HELPERS/OTHER
  ////////////////////////////////////////////////////

  checkOneWay(player, oneway) {

    //if player is higher up the screen then the plaform then enable the collision
    if (player.body.position.y + player.body.height / 2 < oneway.y) {
      return true;
    }
    //otherwise disable collision
    return false;
  }
  makeIndexes() {
    for (let l = 0; l < this.data.layers.length; l++) {
      for (let i = 0; i < this.data.intH; i++) {
        for (let j = 0; j < this.data.intW; j++) {
          const x = this.data.layers[l][i][j][1]
          const y = this.data.layers[l][i][j][0]
          var ind = ((15 + 1) * y) + x
          if (Number.isNaN(ind)) {
            this.data.layers[l][i][j] = 0
          } else {
            this.data.layers[l][i][j] = ind
          }

        }
      }
    }
  }
  explode(x, y) {
    // let posX = this.xOffset + this.dotSize * x + this.dotSize / 2;
    // let posY = this.yOffset + this.dotSize * y + this.dotSize / 2
    var explosion = this.bursts.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    explosion.setOrigin(0.5, 0.5).setScale(1).setDepth(3);
    explosion.x = x;
    explosion.y = y;
    explosion.play('effect-explode');
    explosion.on('animationcomplete', function () {
      explosion.setActive(false);

    }, this);
  }
  addScore() {
    this.events.emit('score');
  }
  updateCoin() {
    this.events.emit('coin');
  }
  updateKey() {
    this.events.emit('key');
  }
}
