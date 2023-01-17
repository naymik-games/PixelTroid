class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {

    var url;

    //   url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    //   this.load.plugin('rexvirtualjoystickplugin', url, true);

  }
  create() {

    this.header = this.add.image(game.config.width / 2, 0, 'blank').setOrigin(.5, 0).setTint(0x000000);//0x262626
    this.header.displayWidth = game.config.width;
    this.header.displayHeight = 125;
    var value = 1
    var progressBox = this.add.graphics();
    var progressBar = this.add.graphics();

    progressBox.fillStyle(0x454545, .8);
    progressBox.fillRect(50, 25, 150, 35);
    progressBar.clear()
    progressBar.fillStyle(0x00ff00, 1);
    progressBar.fillRect(60, 35, 125 * value, 15)
    this.eText = this.add.text(25, 35, 'E', { fontFamily: 'PixelFont', fontSize: '50px', color: '#fafafa', align: 'left' }).setOrigin(.5)//C6EFD8

    this.itemsIcon = this.add.image(game.config.width - 132, 45, 'items', 0).setScale(2)

    this.coinIcon = this.add.image(game.config.width - 48, 45, 'coin', 0).setScale(2)
    this.coinCountText = this.add.text(game.config.width - 74, 35, '0', { fontFamily: 'PixelFont', fontSize: '50px', color: '#C6EFD8', align: 'left' }).setOrigin(1, .5)

    this.keyIcon = this.add.image(game.config.width - 48, 100, rooms[currentRoom].tileKey, keyFrame).setScale(3).setAlpha(0)
    this.Main = this.scene.get('playGame');
    //this.score = 0;
    // this.scoreText = this.add.bitmapText(85, 100, 'topaz', this.score, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    this.controlsY = game.config.height - 75
    /*   var base = this.add.image(0, 0, 'controller_buttons', 0).setScale(2)
      var thumb = this.add.image(0, 0, 'controller_buttons', 1).setScale(2)
      this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        x: game.config.width / 4,
        y: this.controlsY,
        radius: 100,
        base: base,
        thumb: thumb,
        dir: '4dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
        forceMin: 16,
        // enable: true
      })
        .on('update', this.joyStickState, this); */

    this.text = this.add.text(0, 0);
    //this.joyStickState();



    this.aButton = this.add.image(game.config.width - 250, this.controlsY, "controller_buttons", 3).setScale(6).setInteractive();
    this.aButton.on('pointerdown', this.doA, this);
    this.aButton.on('pointerup', this.doADone, this);


    this.bButton = this.add.image(game.config.width - 350, this.controlsY + 25, "controller_buttons", 2).setScale(6).setInteractive();
    this.bButton.on('pointerdown', this.doB, this);
    this.bButton.on('pointerup', this.doBDone, this);

    this.yButton = this.add.image(game.config.width - 150, this.controlsY, "controller_buttons", 4).setScale(6).setInteractive();
    this.yButton.on('pointerdown', this.doY, this);
    this.yButton.on('pointerup', this.doYDone, this);


    this.Main.events.on('score', function () {

      var health = playerData.health
      var value = health / 100
      progressBar.clear()
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(60, 35, 125 * value, 15)
    }, this);
    this.Main.events.on('coin', function () {
      this.coinCountText.setText(this.Main.player.coinCount)

    }, this);
    this.Main.events.on('key', function () {
      this.keyIcon.setAlpha(1)
      var t = this.tweens.add({
        targets: this.keyIcon,
        scale: 8,
        yoyo: true,
        duration: 300
      })
    }, this);
    // this.dpad = new GamePad(this, this.Main)

  }

  update() {

  }
  doA() {

    //this.Main.player.doAction()
    if (this.Main.player.roll) {
      if (!this.Main.player.bombSet && playerData.hasBombs) {
        this.Main.player.bombSet = true
        this.Main.player.setBomb()
      }
    } else {
      this.Main.player.isAttack = true
      if (playerData.weapon == 'sword') {
        this.Main.player.smash()
      } else if (playerData.weapon == 'gun') {
        this.Main.player.shoot()
      }

    }
    // this.main.game.events.emit(EVENTS_NAME.attack);
    // this.main.game.events.emit(EVENTS_NAME.smash);
  }
  doADone() {
    // this.main.player.isAttack = false
    // this.main.game.events.emit(EVENTS_NAME.attack);
    // this.main.game.events.emit(EVENTS_NAME.smash);
  }
  doB() {
    if (playerData.hasMorph) {
      this.Main.player.roll = true
      this.Main.roll()
    }
    //this.Main.player.dpad.isB = true

    // this.main.game.events.emit(EVENTS_NAME.attack);
    // this.main.game.events.emit(EVENTS_NAME.smash);
  }
  doBDone() {
    // this.Main.player.roll = false
    // this.main.player.isAttack = false
    // this.main.game.events.emit(EVENTS_NAME.attack);
    // this.main.game.events.emit(EVENTS_NAME.smash);
  }
  doY() {
    this.Main.player.dpad.isY = true
    // this.main.game.events.emit(EVENTS_NAME.attack);
    // this.main.game.events.emit(EVENTS_NAME.smash);
  }
  doYDone() {
    this.Main.player.dpad.isY = false
    // this.main.player.isAttack = false
    // this.main.game.events.emit(EVENTS_NAME.attack);
    // this.main.game.events.emit(EVENTS_NAME.smash);
  }

  joyStickState() {
    var cursorKeys = this.joyStick.createCursorKeys();
    console.log(cursorKeys.right.isDown)
    if (cursorKeys.right.isDown) {
      this.Main.player.dpad.isRight = true
    } else if (cursorKeys.left.isDown) {
      this.Main.player.dpad.isLeft = true
    } else if (cursorKeys.up.isDown) {
      this.Main.player.dpad.isUp = true
    } else if (cursorKeys.down.isDown) {
      this.Main.player.dpad.isDown = true
    } else {
      //this.Main.player.dpad.isDown = false
      //this.Main.player.dpad.isUp = false
      this.Main.player.dpad.isRight = false
      this.Main.player.dpad.isLeft = false
    }
  }



}