var game = require('./game');

module.exports = function(io) {

  // Client -> Server
  io.sockets.on('connection', function(socket) {
    socket.on('join', function(nick, callback) {
      var id = '' + new Date().getTime() + Math.random();
      game.playerJoined(id, nick);
      socket.on('startMoving', function(direction) {
        game.playerStartedMoving(id, direction);
      });
      socket.on('stopMoving', function() {
        game.playerStoppedMoving(id);
      });
      socket.on('fire', function() {
        game.playerFired(id);
      });
      socket.on('disconnect', function() {
        game.playerLeft(id);
      });
      callback();
    });
  });

  // Server -> Client
  game.on('state', function(state) {
    io.sockets.emit('gameState', state);
  });
  
};

