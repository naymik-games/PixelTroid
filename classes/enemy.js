class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, kind) {

    super(scene, x, y, enemeyConfigs[kind].key);
    this.scene = scene
    const anims = scene.anims;

    this.kind = kind
    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(10, 35)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    scene.add.existing(this);
    scene.physics.add.existing(this);
    enemies.add(this)
    this.setOrigin(.5, .5);
    this.setCollideWorldBounds(true);
    this.setBounce(0)
    if (this.kind == 1 || this.kind == 3 || this.kind == 8) {
      this.body.setAllowGravity(false)
    }
    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength

    this.maxDistance = maxDistance

    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { start: 0, end: 2 }),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')
    if (this.kind == 0 || this.kind == 1) {
      if (Phaser.Math.Between(1, 2) > 1) {
        this.body.velocity.x = -this.vx;
        this.direction = -1;
        this.setFlipX(true)
      } else {
        this.body.velocity.x = this.vx;
        this.direction = 1;
        this.setFlipX(false)
      }
    }


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.kind == 0) {
      if (Math.abs(this.x - this.previousX) >= this.maxDistance) {
        this.toggleFlipX()
        this.body.velocity.y = -200
        this.switchDirection();
      } else {
        if (this.direction == -1 && this.body.blocked.left) {
          // console.log('blocked left')
          this.setFlipX(false)
          this.body.velocity.x = this.vx;
          this.direction = 1
          this.previousX = this.x;
          //this.switchDirection();
        }
        if (this.direction == 1 && this.body.blocked.right) {
          //console.log('blocked right')
          this.setFlipX(true)
          this.body.velocity.x = -this.vx;
          this.direction = -1
          this.previousX = this.x;
          //this.switchDirection();
        }
      }
    } else if (this.kind == 1) {
      if (this.direction == -1 && this.body.blocked.left) {
        // console.log('blocked left')
        this.setFlipX(false)
        this.body.velocity.x = this.vx;
        this.direction = 1
        this.previousX = this.x;
        //this.switchDirection();
      }
      if (this.direction == 1 && this.body.blocked.right) {
        //console.log('blocked right')
        this.setFlipX(true)
        this.body.velocity.x = -this.vx;
        this.direction = -1
        this.previousX = this.x;
        //this.switchDirection();
      }
    }
    if (this.kind == 8) {
      // this.enemyFollows()
      if (Math.abs(this.x - this.scene.player.sprite.x) < this.maxDistance) {
        this.enemyFollowsOnce()
      }
    }
    if (this.kind == 3) {
      // this.enemyFollows()
      if (Math.abs(this.x - this.scene.player.sprite.x) < this.maxDistance) {
        this.enemyFollowsContinuous()
      }
    }

  }
  enemyFollowsOnce() {
    if (!this.launched) {
      this.launched = true
      this.body.setAllowGravity(true)
      this.scene.physics.moveToObject(this, this.scene.player.sprite, 50);
    }

  }
  enemyFollowsContinuous() {
    this.scene.physics.moveToObject(this, this.scene.player.sprite, 15);
  }
  switchDirection() {

    //reverse velocity so baddie moves are same speed but in opposite direction
    this.body.velocity.x *= -1;
    this.direction *= -1
    //reset count
    this.previousX = this.x;
  }
  enemyHit(damage) {
    this.strength -= damage
    if (this.strength > 0) {
      this.hit = false
      var tween = this.scene.tweens.add({
        targets: this,
        alpha: 0.1,
        scale: 1.5,
        yoyo: true,
        ease: 'Linear',
        duration: 100,
      });
    } else {
      this.disableBody(false, false);
      //make player jump up in the air a little bit
      this.scene.explode(this.x, this.y)

      //animate baddie, fading out and getting bigger
      var tween = this.scene.tweens.add({
        targets: this,
        alpha: 0.3,
        scaleX: 1.5,
        scaleY: 1.5,
        ease: 'Linear',
        duration: 200,
        onCompleteScope: this,
        onComplete: function () {
          //remove the game object
          this.scene.addPellet(this.x, this.y)
          destroyGameObject(this);

        },
      });
    }
  }
}

const enemeyConfigs = [{
  strength: 2,
  key: 'enemy01',
  fr: 12
},
{
  strength: 0,
  key: 'enemy02',
  fr: 3
},

{
  strength: 0,
  key: 'enemy03',
  fr: 12
},

{
  strength: 0,
  key: 'enemy04',
  fr: 12
},

{
  strength: 0,
  key: 'enemy05',
  fr: 6
},

{
  strength: 0,
  key: 'enemy06',
  fr: 6
},

{
  strength: 0,
  key: 'enemy07',
  fr: 6
},

{
  strength: 0,
  key: 'enemy08',
  fr: 6
},

{
  strength: 0,
  key: 'enemy09',
  fr: 12
}
]