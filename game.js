var evt = require('events')
  , Direction = {NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4}
  , game = new evt.EventEmitter()
  , state = {};


game.playerJoined = function(nick) {
  state[nick] = {dir: Direction.NONE};
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
  game.emit('state', state);
  setTimeout(gameLoop, 1000);
})();


module.exports = game;
