class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {

    playerData = JSON.parse(localStorage.getItem('PTSave'));
    if (playerData === null || playerData.length <= 0) {
      localStorage.setItem('PTSave', JSON.stringify(playerDataDefault));
      playerData = playerDataDefault;
    }
    currentRoom = playerData.inRoom
    enteredFrom = 'none'
    this.cameras.main.setBackgroundColor(0x000000);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'PixelTroid', 70).setOrigin(.5).setTint(0xc76210);

    var startTime = this.add.bitmapText(game.config.width / 2, 275, 'topaz', 'Play Time', 50).setOrigin(.5).setTint(0xfafafa);
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler, this);

    var deleteGame = this.add.bitmapText(game.config.width / 2, 475, 'topaz', 'Delete Game', 30).setOrigin(.5).setTint(0xfafafa);
    deleteGame.setInteractive();
    deleteGame.on('pointerdown', function () {
      localStorage.removeItem('PTSave');
      localStorage.setItem('PTSave', JSON.stringify(playerDataDefault));
      playerData = playerDataDefault;
    }, this);

  }
  clickHandler() {

    this.scene.start('playGame');

    this.scene.launch('UI');
  }

}