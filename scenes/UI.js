var progressBox, progressBar;
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
    this.tanks = []

    this.header = this.add.image(game.config.width / 2, 0, 'blank').setOrigin(.5, 0).setTint(0x000000);//0x262626
    this.header.displayWidth = game.config.width;
    this.header.displayHeight = 125;
    var value = 1
    progressBox = this.add.graphics();


    progressBox.fillStyle(0x454545, .8);
    progressBox.fillRect(50, 25, 150, 35);

    this.progressBox = this.add.image(50, 25, 'progressBox').setScale(1).setOrigin(0)
    progressBar = this.add.graphics();
    progressBar.clear()
    progressBar.fillStyle(0x00ff00, 1);
    progressBar.fillRect(55, 35, 140 * value, 15)
    this.eText = this.add.text(25, 35, 'E', { fontFamily: 'PixelFont', fontSize: '50px', color: '#fafafa', align: 'left' }).setOrigin(.5)//C6EFD8

    this.messageText = this.add.text(25, 65, 'Acquired Power Suit', { fontFamily: 'PixelFont', fontSize: '40px', color: '#fafafa', align: 'left' }).setOrigin(0)//C6EFD8

    //this.tankIcon = this.add.image(225, 45, 'tankUI', 1).setScale(1)

    this.setTanks()
    this.missleIcon = this.add.image(game.config.width - 150, 45, 'missle_icons', 0).setScale(2).setAlpha(0)
    this.missleCountText = this.add.text(game.config.width - 150, 75, '0', { fontFamily: 'PixelFont', fontSize: '40px', color: '#C6EFD8', align: 'left' }).setOrigin(.5).setAlpha(0)


    this.coinIcon = this.add.image(game.config.width - 48, 45, 'coin', 0).setScale(2)
    this.coinCountText = this.add.text(game.config.width - 74, 35, playerData.coinCount, { fontFamily: 'PixelFont', fontSize: '50px', color: '#C6EFD8', align: 'left' }).setOrigin(1, .5)

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


    //this.sButton.on('pointerup', this.doYDone, this);

    this.Main.events.on('message', function (item) {
      this.messageText.setText('Aquired ' + item)

      var t = this.tweens.add({
        targets: this.messageText,
        alpha: 1,
        delay: 2000,
        duration: 300,
        onCompleteScope: this,
        onComplete: function () {
          var t1 = this.tweens.add({
            targets: this.messageText,
            alpha: 0,
            delay: 2000,
            duration: 300
          })
        }
      })



    }, this);

    this.Main.events.on('tank', function (index) {
      this.addTank(index)
    }, this);
    this.Main.events.on('misslecount', function () {
      this.updateCapacityText()
    }, this);
    this.Main.events.on('missle', function () {
      playerData.missleCount += 10
      playerData.missleCapacity += 10
      this.updateCapacityText()
    }, this);
    this.Main.events.on('collectMissle', function () {

      this.updateCapacityText()
    }, this);
    this.Main.events.on('missleFirst', function () {
      this.missleIcon.setAlpha(1)
      this.missleCountText.setAlpha(1)
      this.sButton = this.add.image(game.config.width - 525, this.controlsY + 25, "controller_buttons", 12).setScale(6).setInteractive();
      this.sButton.on('pointerdown', this.doS, this);
    }, this);
    this.Main.events.on('score', function (amount) {

      if (Math.sign(amount) == -1) {//losing health

        if (playerData.health + amount < 1) { //if new health less than zero
          let tanksIndex = this.getFirstFull()
          if (tanksIndex == -1) {
            playerData.health += amount //no full tanks return back and process death
            return
          }
          // otherwise, empty tank,fill health and subtract remaining damage
          this.tanks[tanksIndex].state = 1
          this.tanks[tanksIndex].setFrame(1)
          var temp = this.tanks[tanksIndex].index
          playerData.tankCount[temp] = 1
          var leftOver = Math.abs(amount + playerData.health)
          playerData.health = 100 - leftOver
          this.updateHealthBar()
          var t = this.tweens.add({
            targets: this.tanks[tanksIndex],
            scale: 0,
            yoyo: true,
            duration: 100
          })
          // tankCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0 don't have, 1 empth, 2 full
        } else { //lose health but not less than zero, deduct and move on
          playerData.health += amount
          this.updateHealthBar()
        }
      } else {//gain health
        if (playerData.health + amount > 100) {//move 100 health to tank
          // tankCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0 don't have, 1 empth, 2 full
          let tanksIndex = this.getFirstEmpty()
          if (tanksIndex == -1) {
            playerData.health = 100 //no empty tanks just max out health and move on
            this.updateHealthBar()
            return
          }
          this.tanks[tanksIndex].state = 2
          this.tanks[tanksIndex].setFrame(0)
          var temp = this.tanks[tanksIndex].index
          playerData.tankCount[temp] = 2
          var extra = (amount + playerData.health) - 100
          playerData.health = extra
          this.updateHealthBar()
          var t = this.tweens.add({
            targets: this.tanks[tanksIndex],
            scale: 2,
            yoyo: true,
            duration: 100
          })
        } else {//other wise add health and move on
          playerData.health += amount
          this.updateHealthBar()
        }
      }



    }, this);
    this.Main.events.on('coin', function () {
      this.coinCountText.setText(playerData.coinCount)

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
  updateHealthBar() {
    var health = playerData.health
    var value = health / 100
    progressBar.clear()
    progressBar.fillStyle(0x00ff00, 1);
    progressBar.fillRect(55, 32.5, 140 * value, 20)
  }
  addTank(index) {
    var x = 0
    var y = 0
    if (this.tanks.length < 5) {
      x = this.tanks.length
      y = 0
    } else {
      x = this.tanks.length - 5
      y = 1
    }
    let tankIcon = this.add.image(215 + x * 20, 25 + y * 20, 'tankUI', 0).setScale(1).setOrigin(.5, 0)
    tankIcon.index = index
    tankIcon.state = 2
    playerData.tankCount[index] = 2
    this.tanks.push(tankIcon)
    /*   let tankIcon = this.add.image(215 + 0 * 20, 25, 'tankUI', 0).setScale(1).setOrigin(.5, 0)
      let tankIcon1 = this.add.image(215 + 1 * 20, 25, 'tankUI', 0).setScale(1).setOrigin(.5, 0)
      let tankIcon2 = this.add.image(215 + 2 * 20, 25, 'tankUI', 0).setScale(1).setOrigin(.5, 0)
      let tankIconTest = this.add.image(215, 45, 'tankUI', 0).setScale(1).setOrigin(.5, 0) */

  }
  setTanks() {
    var counter = 0
    for (var i = 0; i < playerData.tankCount.length; i++) {
      var x = 0
      var y = 0

      if (playerData.tankCount[i] > 0) {
        if (counter < 5) {
          x = counter
          y = 0
        } else {
          x = counter - 5
          y = 1
        }


        if (playerData.tankCount[i] == 1) {
          var frame = 1
        } else if (playerData.tankCount[i] == 2) {
          var frame = 0
        }
        let tankIcon = this.add.image(215 + x * 20, 25 + y * 20, 'tankUI', frame).setScale(1).setOrigin(.5, 0)
        tankIcon.index = i
        tankIcon.state = playerData.tankCount[i]
        this.tanks.push(tankIcon)
        counter++
      }

    }
  }
  getFirstFull() {
    for (var i = this.tanks.length - 1; i > -1; i--) {
      if (this.tanks[i].state == 2) {
        return i
      }
    }
    return -1
  }
  getFirstEmpty() {
    for (var i = this.tanks.length - 1; i > -1; i--) {
      if (this.tanks[i].state == 1) {
        return i
      }
    }
    return -1
  }
  countEmpty() {
    let counter = 0;
    for (state of playerData.tankCount) {
      if (state == 1) {
        counter++;
      }
    };
    return counter
  }
  countAll() {
    let counter = 0;
    for (var i = 0; i < playerData.tankCount.length; i++) {
      if (playerData.tankCount[i] > 0) {
        counter++;
      }
    };
    return counter
  }
  updateCapacityText() {
    this.missleCountText.setText(playerData.missleCount + '/' + playerData.missleCapacity)
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
  doS() {
    if (!playerData.hasMissle) { return }
    if (this.Main.player.missleActive) {
      this.Main.player.missleActive = false
      this.missleIcon.setFrame(0)
    } else {
      this.Main.player.missleActive = true
      this.missleIcon.setFrame(1)
    }

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