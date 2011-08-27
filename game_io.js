var game = require('./game')
  , uid = require('./uid')
  , _ = require('underscore');

module.exports = function(io) {

  // Client -> Server
  io.sockets.on('connection', function(socket) {
    socket.on('join', function(nick, callback) {
      if (_(game.getNicks()).include(nick)) {
        callback({status: false});
      } else {
        var id = uid();
        game.playerJoined(id, nick);
        socket.on('startMoving', function(direction, callback) {
          game.playerStartedMoving(id, direction);
          if (callback) callback();
        });
        socket.on('stopMoving', function(callback) {
          game.playerStoppedMoving(id);
          if (callback) callback();
        });
        socket.on('fire', function(callback) {
          game.playerFired(id);
          if (callback) callback();
        });
        socket.on('disconnect', function() {
          game.playerLeft(id);
        });
        callback({status: true, gameState: game.getState()});
      }
    });
  });

  // Server -> Client
  game.on('stateDelta', function(stateDelta) {
    io.sockets.emit('gameStateDelta', stateDelta);
  });
  
};

