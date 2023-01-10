class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, type) {
    super(scene, x, y, enemeyConfigs[type].key);
    console.log(type)
    const anims = scene.anims;
    anims.create({
      key: "enemy-run",
      frames: this.anims.generateFrameNumbers(enemeyConfigs[type].key, { start: 0, end: 2 }),
      frameRate: enemeyConfigs[type].fr,
      repeat: -1
    });
    this.type = type
    //this.play('thrust');
    var tiles = Phaser.Math.Between(7, 12)
    this.vx = Phaser.Math.Between(10, 35)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(.5, .5);
    this.setCollideWorldBounds(true);
    this.setBounce(0)
    if (this.type == 1) {
      console.log(enemeyConfigs[this.type].key)
      this.body.setAllowGravity(false)
    }
    this.previousX = this.x;
    this.strength = enemeyConfigs[type].strength

    this.maxDistance = maxDistance
    this.play('enemy-run')
    enemies.add(this)
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
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

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
  switchDirection() {

    //reverse velocity so baddie moves are same speed but in opposite direction
    this.body.velocity.x *= -1;
    this.direction *= -1
    //reset count
    this.previousX = this.x;
  }
}

const enemeyConfigs = [{
  strength: 0,
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
}
]