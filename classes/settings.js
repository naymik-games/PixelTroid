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
  powerupGroup,
  pellets,
  doors,
  bombRadius,
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

let coinFrame = 67
let shellFrame = 32
let questionFrame = 4
let keyFrame = 55
let collapseFrame = 42
let oneWayFrame = 5
let ladderFrame = 24
let spikeFrame = 7
let boxFrame = 43
let bulletFrame = 90
let bombFrame = 41
let lavaLauncherFrame = 6
let lavaBallFrame = 70
let pushableFrame = 3
let doorFrame = 28
let sparkFrame = 96
let beamFrame = 30
let buttonFrame = 14

let playerStandBodyX = 12
let playerStandBodyXOffset = 26
let playerRollBodyX = 12
let playerRollBodyXOffset = 26

let playerStandBodyY = 20
let playerStandBodyYOffset = 12
let playerRollBodyY = 12
let playerRollBodyYOffset = 20

//power ups  invincible,            items roll