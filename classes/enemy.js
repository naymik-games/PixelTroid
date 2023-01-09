class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'enemy01');

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
    this.previousX = this.x;


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