let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 250,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}




function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
    document.fonts.add(loaded);
  }).catch(function (error) {
    return error;
  });
}
loadFont("PixelFont", "assets/fonts/mago1.ttf");
loadFont("PixelFontWide", "assets/fonts/mago3.ttf");



function destroyGameObject(gameObject) {
  gameObject.destroy();
}

let gameSettings;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  totalSquares: 0,
  group: 0,
  currentLevel: 0
}

let layer,
  touchSlider,
  cursors,
  onLadder = false,
  acceleration = 600,
  sliderBar,
  sliderKnob,
  touchMoving = false,
  touchMoveThreshold = 3,
  largeThumbMoveAcross = 15,
  thumbSizeOffset = 30,
  startX,
  prevPos = 0,
  isTouch = false,
  jumping = false,
  jumps = 1,
  yPos = 0,
  standing,
  coins,
  keys,
  shells,
  shell,
  questions,
  collapsingPlatforms,
  hPlatforms,
  oneWayBlocks,
  enemies,
  ladders,
  spikes,
  boxes,
  bombs,
  bullets,
  sparks,
  beams,
  buttons,
  lavaLaunchers,
  lavaBall,
  pushableBlocks,
  reappearingBlocks,
  powerupGroup,
  pellets,
  doors,
  bombRadius,
  lava,
  bulletSpeed = 250,
  shellSpeed = 200,
  wasStanding = false,
  edgeTimer = 0,
  touchJump = false,
  touchJumpThreshold = 10,
  groundAcceleration = 600,
  jumpVelocity = 350,
  vulnerableTime = 1000,
  invicibility,
  superPlayerSpeed = 400;

let coinFrame = 32
let shellFrame = 48
let questionFrame = 1
let keyFrame = 26
let collapseFrame = 6
let oneWayFrame = 2
let ladderFrame = 24
let spikeFrame = 4
let boxFrame = 7
let bulletFrame = 90
let bombFrame = 36
let lavaLauncherFrame = 3
let lavaBallFrame = 37
let pushableFrame = 8
let doorRFrame = 25
let doorLFrame = 27
let sparkFrame = 20
let beamFrame = 16
let buttonFrame = 14
let reappearFrame = 5
let lavaFrame = 10

let playerStandBodyX = 12
let playerStandBodyXOffset = 10
let playerRollBodyX = 12
let playerRollBodyXOffset = 10

let playerStandBodyY = 30
let playerStandBodyYOffset = 2
let playerRollBodyY = 12
let playerRollBodyYOffset = 20

//power ups  invincible,            items roll
let currentRoom = 0
let rooms = [
  {
    id: 0,
    tileFile: 'metroid_tiles',
    tileKey: 'tiles',
    background: 0x000000,
    fromID: null,
    toID: 1
  }
]