var game = require('./game');

module.exports = function(io) {

  // Client -> Server
  io.sockets.on('connection', function(socket) {
    socket.on('join', function(nick, callback) {
      var id = '' + new Date().getTime() + Math.random();
      game.playerJoined(id, nick);
      socket.on('startMoving', function(direction, callback) {
        game.playerStartedMoving(id, direction);
        callback();
      });
      socket.on('stopMoving', function(callback) {
        game.playerStoppedMoving(id);
        callback();
      });
      socket.on('fire', function(callback) {
        game.playerFired(id);
        callback();
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

