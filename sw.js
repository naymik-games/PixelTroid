var cacheName = 'PixelDots v1.01';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',



  '/scenes/preload.js',
  '/scenes/startGame.js',
  //'/scenes/selectGame.js',
  //'/scenes/preview.js',
  // '/scenes/endGame.js',
  // '/scenes/endGameChallenge.js',
  // '/scenes/levelBuilder.js',
  '/scenes/UI.js',

  '/assets/fonts/topaz.png',
  '/assets/fonts/topaz.xml',
  '/assets/fonts/mago1.tff',
  '/assets/fonts/mago3.tff',

  '/classes/dpad.js',
  '/classes/settings.js',
  '/classes/enemy.js',
  '/classes/player.js',

  '/assets/particle.png',
  '/assets/particles.png',


  '/assets/sprites/bullet.png',
  '/assets/sprites/blank.png',
  '/assets/sprites/coin.png',
  '/assets/sprites/enemy01.png',
  '/assets/sprites/explosion.png',
  '/assets/sprites/nokia_coin.png',
  '/assets/sprites/nokia_space.png',
  '/assets/sprites/nokia_tiles.png',
  '/assets/sprites/pellet.png',
  '/assets/sprites/powerups.png',
  '/assets/sprites/switch.png',


  '/assets/levels/nokiastuff.png',




  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});