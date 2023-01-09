class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/particle.png");
    }




    //this.load.image("particle", "assets/sprites/particle.png");
    this.load.bitmapFont('topaz', 'assets/fonts/topaz.png', 'assets/fonts/topaz.xml');
    this.load.spritesheet("menu_icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });
    this.load.spritesheet("rover", "assets/sprites/rover.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("tiles", "assets/sprites/nokia_tiles.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet("tiles_", "assets/sprites/nokia_tiles_dark.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet("tiles___", "assets/sprites/nokia_tiles_grey.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet('coin', 'assets/sprites/nokia_coin.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    /*  this.load.spritesheet('player', 'assets/sprites/player.png', {
       frameWidth: 24,
       frameHeight: 12
     }); */
    this.load.spritesheet('player', 'assets/sprites/nokia_space.png', {
      frameWidth: 64,
      frameHeight: 32
    });
    this.load.spritesheet('controller_buttons', 'assets/controls/controller_buttons.png', {
      frameWidth: 22,
      frameHeight: 22
    });
    this.load.spritesheet('enemy01', 'assets/sprites/enemy01.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('powerups', 'assets/sprites/powerups.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('explode', 'assets/sprites/explosion.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('bullet', 'assets/sprites/bullet.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('pellet', 'assets/sprites/pellet.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image('platform', 'assets/sprites/platform.png')

    this.load.image('aButton', 'assets/controls/a_button.png')
    this.load.image('cross', 'assets/controls/dpad.png');
    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image("touch-slider", "assets/controls/touch-slider.png");
    this.load.image("touch-knob", "assets/controls/touch-knob.png");
    // this.load.json('level', 'assets/test8.json');
    this.load.tilemapTiledJSON('level', 'assets/levels/nokia1.json')
  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}







