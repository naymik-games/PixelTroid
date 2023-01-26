class mapScene extends Phaser.Scene {
  constructor() {
    super("mapScene");
  }
  preload() {


  }
  create() {



    this.home = this.add.image(350, 400, 'menu_icons', 3).setScale(1).setInteractive().setTint(0xc76210);
    this.home.on('pointerdown', function () {

      this.scene.start('startGame');
      this.scene.stop('playGame');
      this.scene.stop('UI');
      this.scene.stop();

    }, this);


    var exit = this.add.image(game.config.width / 2, game.config.height / 2 + 475, 'menu_icons', 2)

    exit.setInteractive();
    exit.on('pointerdown', function () {

      this.scene.stop();

      this.scene.resume('playGame');
      this.scene.resume('UI');
    }, this);
  }

}
