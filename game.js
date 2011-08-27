var evt = require('events')
  , _ = require('underscore')
  , Direction = {NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4}
  , Speed = {PANDA: 10, PROJECTILE: 20}
  , frameRate = 2
  , game = new evt.EventEmitter()
  , state = {};

function updateElementPosition(el) {
  var speed = Speed[el.type]
  switch (el.dir) {
    case Direction.UP:    el['y'] -= speed; break;
    case Direction.DOWN:  el['y'] += speed; break;
    case Direction.LEFT:  el['x'] -= speed; break;
    case Direction.RIGHT: el['x'] += speed; break;
  }
}

function updatePositions() {
  _(state).each(updateElementPosition);
};

game.playerJoined = function(nick) {
  state[nick] = {type: 'PANDA', x: 0, y: 0, dir: Direction.NONE};
};
game.playerLeft = function(nick) {
  delete state[nick];
};
game.playerStartedMoving = function(nick, dir) {
  state[nick]['dir'] = dir;
};
game.playerStoppedMoving = function(nick) {
  state[nick]['dir'] = Direction.NONE;
};
game.playerFired = function(nick) {
  console.log(nick, ' fired');
};

(function gameLoop() {
  updatePositions();
  game.emit('state', state);
  setTimeout(gameLoop, 1000 / frameRate);
})();


module.exports = game;
