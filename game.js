var evt = require('events');

var game = new evt.EventEmitter()
  , state = {};


game.playerJoined = function(nick) {
  state[nick] = {};
};
game.playerLeft = function(nick) {
  delete state[nick];
};
game.playerStartedMoving = function(nick, dir) {
  state[nick]['dir'] = dir;
};
game.playerStoppedMoving = function(nick) {
  delete state[nick]['dir'];
};
game.playerFired = function(nick) {
  console.log(nick, ' fired');
};

(function gameLoop() {
  game.emit('state', state);
  setTimeout(gameLoop, 1000);
})();


module.exports = game;
