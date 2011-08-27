var evt = require('events')
  , _ = require('underscore')
  , gameWidth = 600
  , gameHeight = 600
  , Direction = {NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4}
  , Speed = {PANDA: 10, PROJECTILE: 20}
  , frameRate = 2
  , game = new evt.EventEmitter()
  , pandas = {}
  , projectiles = [];

game.playerJoined = function(id, nick) {
  pandas[id] = {type: 'PANDA', nick: nick, x: gameWidth / 2, y: gameHeight / 2, dir: Direction.NONE};
};
game.playerLeft = function(id) {
  delete pandas[id];
};
game.playerStartedMoving = function(id, dir) {
  pandas[id]['dir'] = dir;
};
game.playerStoppedMoving = function(id) {
  pandas[id]['dir'] = Direction.NONE;
};
game.playerFired = function(id) {
  var panda = pandas[id];
  projectiles.push({type: 'PROJECTILE', x: panda.x, y: panda.y, dir: panda.dir});
};

function updateElementPosition(el) {
  var speed = Speed[el.type];
  switch (el.dir) {
    case Direction.UP:    el['y'] -= speed; break;
    case Direction.DOWN:  el['y'] += speed; break;
    case Direction.LEFT:  el['x'] -= speed; break;
    case Direction.RIGHT: el['x'] += speed; break;
  }
}

function updatePositions() {
  _(pandas).each(updateElementPosition);
  _(projectiles).each(updateElementPosition);
};


(function gameLoop() {
  updatePositions();

  var state = _(pandas).values().concat(projectiles);
  game.emit('state', state);
  
  setTimeout(gameLoop, 1000 / frameRate);
})();


module.exports = game;
