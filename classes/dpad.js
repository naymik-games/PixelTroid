class GamePad {
  constructor(scene, main) {
    //super();
    this.scene = scene;//UI
    this.main = main

    // let back = this.scene.add.image(-30, 0, "controlBack").setOrigin(0, 0);


    //
    //
    //
    this.cross = this.scene.add.image(game.config.width / 4, game.config.height - 100, 'cross').setScale(.5);

    //
    //
    //


    /* this.btn1 = this.scene.add.image(0, 0, "redButton");
    Align.scaleToGameW(this.btn1, .1);
    this.grid.placeAtIndex(18, this.btn1); */
    //
    //
    //
    /*    this.btn2 = this.scene.add.image(0, 0, "redButton");
       Align.scaleToGameW(this.btn2, .1);
       this.grid.placeAtIndex(20, this.btn2); */
    //
    //
    //
    this.btnUp = this.scene.add.image(this.cross.x, this.cross.y - 25, "blank").setScale(.25);
    this.btnDown = this.scene.add.image(this.cross.x, this.cross.y + 25, "blank").setScale(.25);
    this.btnLeft = this.scene.add.image(this.cross.x - 25, this.cross.y, "blank").setScale(.25);
    this.btnRight = this.scene.add.image(this.cross.x + 25, this.cross.y, "blank").setScale(.25);
    this.btnMid = this.scene.add.image(this.cross.x + 75, this.cross.y, "aButton").setScale(.25);
    //
    //
    //
    this.btnUp.setInteractive();
    this.btnDown.setInteractive();
    this.btnLeft.setInteractive();
    this.btnRight.setInteractive();
    this.btnMid.setInteractive();
    // this.btn1.setInteractive();
    //  this.btn2.setInteractive();
    //
    //
    //
    this.btnUp.on('pointerdown', this.goUp.bind(this));
    this.btnDown.on('pointerdown', this.goDown.bind(this));
    this.btnLeft.on('pointerdown', this.goLeft.bind(this));
    this.btnRight.on('pointerdown', this.goRight.bind(this));
    this.btnMid.on('pointerdown', this.doAttach.bind(this));
    this.btnMid.on('pointerup', this.doAttachDone.bind(this));

    this.btnUp.on('pointerup', this.goUpDone.bind(this));
    this.btnDown.on('pointerup', this.goDownDone.bind(this));
    this.btnLeft.on('pointerup', this.goLeftDone.bind(this));
    this.btnRight.on('pointerup', this.goRightDone.bind(this));
    // this.btn1.on('pointerdown', this.btn1Pressed.bind(this));
    //  this.btn2.on('pointerdown', this.btn2Pressed.bind(this));
    //
    //
    //
    //
    this.btnUp.alpha = .02;
    this.btnDown.alpha = .02;
    this.btnLeft.alpha = .02;
    this.btnRight.alpha = .02;
    this.btnMid.alpha = 1;
    //

    /* */

  }
  doAttach() {
    this.main.player.isAttack = true
    // this.main.game.events.emit(EVENTS_NAME.attack);
    // this.main.game.events.emit(EVENTS_NAME.smash);
  }
  doAttachDone() {
    // this.main.player.isAttack = false
    // this.main.game.events.emit(EVENTS_NAME.attack);
    // this.main.game.events.emit(EVENTS_NAME.smash);
  }
  goUp() {
    //console.log("go Up");
    this.main.isUp = false
    this.main.isDown = false
    this.main.isLeft = false
    this.main.isRight = false
    this.main.isUp = true
  }
  goDown() {
    //console.log("go Down");
    this.main.player.dpad.isDown = true

  }
  goLeft() {
    // console.log("go Left")
    this.main.player.dpad.isLeft = true
  }
  goRight() {
    // console.log("go Right");
    this.main.player.dpad.isRight = true
  }

  goUpDone() {
    //console.log("go Up");
    this.main.player.dpad.isUp = false

  }
  goDownDone() {
    //console.log("go Down");
    this.main.player.dpad.isDown = false

  }
  goLeftDone() {
    // console.log("go Left")
    this.main.player.dpad.isLeft = false
  }
  goRightDone() {
    // console.log("go Right");
    this.main.player.dpad.isRight = false
  }
  btn1Pressed() {
    console.log("btn1 pressed");
  }
  btn2Pressed() {
    console.log("btn2 pressed");
  }
}