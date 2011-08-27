var evt = require('events')
  , _ = require('underscore')
  , Direction = {NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4}
  , frameRate = 2
  , tankSpeed = 10
  , game = new evt.EventEmitter()
  , state = {};

function updateElementPosition(el) {
  switch (el.dir) {
    case Direction.UP:    el['y'] -= tankSpeed; break;
    case Direction.DOWN:  el['y'] += tankSpeed; break;
    case Direction.LEFT:  el['x'] -= tankSpeed; break;
    case Direction.RIGHT: el['x'] += tankSpeed; break;
  }
}

function updatePositions() {
  _(state).each(updateElementPosition);
};

game.playerJoined = function(nick) {
  state[nick] = {type: 'panda', x: 0, y: 0, dir: Direction.NONE};
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
