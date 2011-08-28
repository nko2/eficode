var game = require('./game')
  , uid = require('./uid')
  , _ = require('underscore');

module.exports = function(io) {

  // Client -> Server
  io.sockets.on('connection', function(socket) {
    var joined = false;
    
    socket.on('join', function(nick, callback) {
      if (_(game.getNicks()).include(nick) || nick.trim().length === 0 || joined === true) {
        callback(false);
      } else {
        joined = true;
        
        var id = uid();
        socket.on('startGame', function(callback) {
          game.playerJoined(id, nick);
          callback(game.getState());
        });
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
        callback(true);
      }
    });
  });

  // Server -> Client
  game.on('stateDelta', function(stateDelta) {
    io.sockets.emit('gameStateDelta', stateDelta);
  });
  
};

