


class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, kind) {

    super(scene, x, y, enemeyConfigs[kind].key);
    this.scene = scene
    this.kind = kind
    scene.add.existing(this);
    scene.physics.add.existing(this);
    enemies.add(this)
    this.setOrigin(.5, .5);
    this.setCollideWorldBounds(true);
    this.setBounce(0)


  }

  switchDirection() {

    //reverse velocity so baddie moves are same speed but in opposite direction
    this.body.velocity.x *= -1;
    this.direction *= -1
    //reset count
    this.previousX = this.x;
  }
  enemyFollowsOnce() {
    if (!this.launched) {
      this.launched = true
      this.body.setAllowGravity(true)
      this.scene.physics.moveToObject(this, this.scene.player.sprite, 50);
    }

  }
  enemyHit(damage) {
    this.strength -= damage
    if (this.strength > 0) {

      if (playerData.hasIce) {
        if (this.frozen) {
          this.frozen = false
          this.body.velocity.x = this.saveXYV.x
          this.body.velocity.y = this.saveXYV.y
          this.clearTint()
        } else {
          this.saveXYV.x = this.body.velocity.x
          this.saveXYV.y = this.body.velocity.y
          this.body.velocity.x = 0
          this.body.velocity.y = 0
          this.frozen = true
          this.setTint(0x0000ff)
        }

      }
      var tween = this.scene.tweens.add({
        targets: this,
        alpha: 0.1,
        scale: 1.5,
        yoyo: true,
        ease: 'Linear',
        duration: 100,
      });
      this.hit = false
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
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 1
////////////////////////////////////////////////////////////////////////////////////
class Enemy01 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(10, 35)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { start: 0, end: 2 }),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.frozen) {
      this.scene.physics.add.collider(this.scene.player.sprite, this, this.scene.hitEnemy, null, this.scene);
    } else {
      this.scene.physics.add.overlap(this.scene.player.sprite, this, this.scene.hitEnemy, null, this.scene);
    }

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

  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 2
////////////////////////////////////////////////////////////////////////////////////
class Enemy02 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(10, 35)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    this.body.setAllowGravity(false)

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { start: 0, end: 2 }),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.frozen) {
      this.scene.physics.add.collider(this.scene.player.sprite, this, this.scene.hitEnemy, null, this.scene);
    } else {
      this.scene.physics.add.overlap(this.scene.player.sprite, this, this.scene.hitEnemy, null, this.scene);
    }
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

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 9
////////////////////////////////////////////////////////////////////////////////////
class Enemy09 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(10, 35)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    this.body.setAllowGravity(false)

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { start: 0, end: 2 }),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.frozen) {
      this.scene.physics.add.collider(this.scene.player.sprite, this, this.scene.hitEnemy, null, this.scene);
    } else {
      this.scene.physics.add.overlap(this.scene.player.sprite, this, this.scene.hitEnemy, null, this.scene);
    }
    if (Math.abs(this.x - this.scene.player.sprite.x) < this.maxDistance) {
      this.enemyFollowsOnce()
    }


  }

}
////////////////////////////////////////////////////////////////////////////////

const enemeyConfigs = [{
  //enemy 1 walks side to side
  strength: 4,
  key: 'enemy01',
  fr: 12,
  damage: 5
},
{
  //eneny 2 flies side to side
  strength: 4,
  key: 'enemy02',
  fr: 3,
  damage: 5
},

{
  strength: 0,
  key: 'enemy03',
  fr: 12,
  damage: 5
},

{
  //Enemy4 attracked to player withing range
  strength: 2,
  key: 'enemy04',
  fr: 12,
  damage: 5
},

{
  strength: 0,
  key: 'enemy05',
  fr: 6,
  damage: 5
},

{
  strength: 0,
  key: 'enemy06',
  fr: 6,
  damage: 5
},

{
  strength: 0,
  key: 'enemy07',
  fr: 6,
  damage: 5
},

{
  strength: 0,
  key: 'enemy08',
  fr: 6,
  damage: 5
},

{
  //Enemy9 flies down to ground towards payer when near
  strength: 6,
  key: 'enemy09',
  fr: 12,
  damage: 7
}
]