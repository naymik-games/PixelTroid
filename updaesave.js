update() {

  //if either touch pointer is down. Two thumbs, two pointers
  if (this.input.pointer1.isDown || this.input.pointer2.isDown) { //this.input.activePointer.isDown || 
    //work out half way point of our game
    var leftHalf = game.config.width / 2;

    //Left hand side - horizontal movement
    //if thumb is on the left hand side of the screen we are dealing with horizontal movement
    if (this.input.pointer1.x < leftHalf || this.input.pointer2.x < leftHalf) { //this.input.activePointer.x < leftHalf || 
      //reset pointer variable
      var myMovePointer = null;
      //here we get the pointer that is being used on the left hand side of screen. Depends which thumb they touched screen with first.
      /*   if (this.input.activePointer.x < leftHalf && this.input.activePointer.isDown) {
          myMovePointer = this.input.activePointer;
        } */
      if (this.input.pointer1.x < leftHalf && this.input.pointer1.isDown) {
        myMovePointer = this.input.pointer1;
      }
      if (this.input.pointer2.x < leftHalf && this.input.pointer2.isDown) {
        myMovePointer = this.input.pointer2;
      }

      //if we have an active touch pointer on the left hand side of the screen then...
      if (myMovePointer) {
        //if touchSlide is not already showing then
        if (!touchSlider.alpha) {
          //make it visible
          touchSlider.alpha = 1;
          //position touchSlider to be where the users thumb or finger is
          // const worldPoint = myMovePointer.positionToCamera(this.cameras.main)
          touchSlider.x = myMovePointer.x//;this.player.x
          //with the Y pos we add a thumbSizeOffset so it's above the users thumb not hidden under it
          touchSlider.y = myMovePointer.y - thumbSizeOffset;
          //set our start point and reset slider display
          startX = myMovePointer.x;
          sliderKnob.x = 0;
        }

        //if thumb has moved left or right of where we started then move
        if (myMovePointer.x < startX || myMovePointer.x > startX) {
          //work out how far thumb has moved. Is this a big enough movement?
          var movement = 0;
          if (myMovePointer.x < startX) movement = startX - myMovePointer.x;
          if (myMovePointer.x > startX) movement = myMovePointer.x - startX;
          //If move is significant enough then move our character
          if (movement > touchMoveThreshold) {
            //set flag as we are definitely moving
            touchMoving = true;

            //set slider knob position to be half way to edge
            var sliderPos = 0;
            //left
            if (myMovePointer.x < startX) sliderPos = -(sliderBar.displayWidth / 4);
            //right
            if (myMovePointer.x > startX) sliderPos = sliderBar.displayWidth / 4;

            //set acceleration to be an 8th of normal
            var tmpAcceleration = groundAcceleration / 8;

            //if thumb has moved quite a lot, then go faster
            if (movement > largeThumbMoveAcross) {
              //the knob position should be at the edge as we're at full tilt
              if (myMovePointer.x < startX) sliderPos = -(sliderBar.displayWidth / 2);
              if (myMovePointer.x > startX) sliderPos = sliderBar.displayWidth / 2;
              //acceleration is normal
              tmpAcceleration = groundAcceleration;
            }

            //tween slider knob to position we just worked out
            var tween = this.tweens.add({
              targets: sliderKnob,
              x: sliderPos,
              ease: "Power1",
              duration: 300
            });
            if (myMovePointer.x < startX) {
              // groundAcceleration = tmpAcceleration
              this.player.dpad.isLeft = true//moveLeft(tmpAcceleration);
            }
            if (myMovePointer.x > startX) {
              //groundAcceleration = tmpAcceleration
              this.player.dpad.isRight = true//moveRight(tmpAcceleration);
            }
          } else {
            //If move is really, really small then we don't count it. Stop moving
            //set moving flag to false
            touchMoving = false;
            //reset slider knob to center position
            var tween = this.tweens.add({
              targets: sliderKnob,
              x: 0,
              ease: "Power1",
              duration: 300
            });
          }
        }
      }
    }

    //Right hand side - Touch Jumping
    //if thumb is on the right hand side of the screen we are dealing with vertical movement - i.e. jumping.
    if (this.input.pointer1.x > leftHalf || this.input.pointer2.x > leftHalf) {
      //reset pointer variable
      var myJumpPointer = null;
      //get active touch pointer for this side of the screen
      if (this.input.pointer1.x > leftHalf && this.input.pointer1.isDown) {
        myJumpPointer = this.input.pointer1;
      }
      if (this.input.pointer2.x > leftHalf && this.input.pointer2.isDown) {
        myJumpPointer = this.input.pointer2;
      }
      //if we have a touch pointer on right hand side of screen...
      if (myJumpPointer) {
        //store last y position of touch pointer
        prevPos = yPos;
        //get new position of touch pointer
        yPos = myJumpPointer.y;

        //if we have moved our thump upwards and it's more than our threshold then we set jump flag to true
        if (prevPos - yPos > touchJumpThreshold) {
          //touchJump = true;
          this.player.dpad.isY = true
        }
      }
    }
    //neither thumb is down so reset touch movement variables and hide touchSlider
  } else {
    this.player.dpad.isLeft = false
    this.player.dpad.isRight = false
    this.player.dpad.isY = false
    groundAcceleration = 600
    touchSlider.alpha = 0;
    startX = 0;
    touchMoving = false;
  }



  this.player.update();
  /*     const onGround = this.player.body.blocked.down;
      if (cursors.left.isDown) {
        this.player.setVelocityX(-160)
      } else if (cursors.right.isDown) {
        this.player.setVelocityX(160)
      } else {
        this.player.setVelocityX(0)
      }
      if (cursors.up.isDown && onGround) {
        this.player.setVelocityY(-330)
      } */
}