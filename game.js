var evt = require('events')
  , _ = require('underscore')
  , gameWidth = 600, gameHeight = 600
  , pandaWidth = 15, pandaHeight = 15
  , Direction = {NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4}
  , Speed = {PANDA: 10, PROJECTILE: 20}
  , frameRate = 3
  , game = new evt.EventEmitter()
  , pandas = {}
  , projectiles = [];

game.playerJoined = function(id, nick) {
  pandas[id] = {
    type: 'PANDA',
    nick: nick,
    x: gameWidth / 2,
    y: gameHeight / 2,
    dir: Direction.NONE,
    moving: false
  };
};
game.playerLeft = function(id) {
  delete pandas[id];
};
game.playerStartedMoving = function(id, dir) {
  var panda = pandas[id];
  panda.dir = dir;
  panda.moving = true;
};
game.playerStoppedMoving = function(id) {
  pandas[id]['moving'] = false;
};
game.playerFired = function(id) {
  var panda = pandas[id];
  projectiles.push({type: 'PROJECTILE', x: panda.x, y: panda.y, dir: panda.dir});
};

function updatePandaPosition(panda) {
  if (!panda.moving) return;
  
  var speed = Speed.PANDA;
  switch (panda.dir) {
    case Direction.UP:
      panda.y = Math.max(panda.y - speed, 0);
      break;
    case Direction.DOWN:
      panda.y = Math.min(panda.y + speed, gameHeight - pandaHeight);
      break;
    case Direction.LEFT:
      panda.x = Math.max(panda.x - speed, 0);
      break;
    case Direction.RIGHT:
      panda.x = Math.min(panda.x + speed, gameWidth - pandaWidth);
      break;
  }
};

function updateProjectilePosition(p) {
  var speed = Speed.PROJECTILE;
  switch (p.dir) {
    case Direction.UP:    p.y -= speed; break;
    case Direction.DOWN:  p.y += speed; break;
    case Direction.LEFT:  p.x -= speed; break;
    case Direction.RIGHT: p.x += speed; break;
  }
};

function isInsideGameArea(el) {
  return el.x >= 0 && el.x <= gameWidth && el.y >= 0 && el.y <= gameHeight;
}

function updatePositions() {
  _(pandas).each(updatePandaPosition);
  _(projectiles).each(updateProjectilePosition);
  projectiles = _(projectiles).select(isInsideGameArea);
};


(function gameLoop() {
  updatePositions();

  var state = _(pandas).values().concat(projectiles);
  game.emit('state', state);
  
  setTimeout(gameLoop, 1000 / frameRate);
})();


module.exports = game;
