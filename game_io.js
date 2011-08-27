var game = require('./game');

module.exports = function(io) {

  // Client -> Server
  io.sockets.on('connection', function(socket) {
    socket.on('join', function(nick, callback) {
      game.playerJoined(nick);
      socket.on('startMoving', function(direction) {
        game.playerStartedMoving(nick, direction);
      });
      socket.on('stopMoving', function() {
        game.playerStoppedMoving(nick);
      });
      socket.on('fire', function() {
        game.playerFired(nick);
      });
      socket.on('disconnect', function() {
        game.playerLeft(nick);
      });
      callback();
    });
  });

  // Server -> Client
  game.on('state', function(state) {
    io.sockets.emit('gameState', state);
  });
  
};

