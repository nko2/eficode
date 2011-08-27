var evt = require('events');

var game = new evt.EventEmitter()
  , players = {};


game.playerJoined = function(nick) {
  players[nick] = {};
};
game.playerLeft = function(nick) {
  delete players[nick];
};

(function gameLoop() {
  game.emit('state', players);
  setTimeout(gameLoop, 1000);
})();


module.exports = game;
