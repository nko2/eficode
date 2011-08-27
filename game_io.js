var game = require('./game')
  , _ = require('underscore');


function serializeState(state) {
  var serializedState = {};
  if (state.pandas && state.pandas.length > 0) {
    serializedState.pa = _(state.pandas).map(function(panda) {
      return [panda.nick, panda.x, panda.y, panda.dir, panda.moving, panda.health, panda.score];
    });
  }
  if (state.projectiles && state.projectiles.length > 0) {
    serializedState.pr = _(state.projectiles).map(function(proj) {
      return [proj.x, proj.y, proj.dir];
    });
  }
  if (state.explosions && state.explosions.length > 0) {
    serializedState.e = _(state.explosions).map(function(exp) {
      return [exp.x, exp.y];
    });
  }
  return serializedState;
}

module.exports = function(io) {

  // Client -> Server
  io.sockets.on('connection', function(socket) {
    socket.on('join', function(nick, callback) {
      if (_(game.getNicks()).include(nick)) {
        callback({status: false});
      } else {
        var id = '' + new Date().getTime() + Math.random();
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
        callback({status: true, gameState: serializeState(game.getState())});
      }
    });
  });

  // Server -> Client
  game.on('state', function(state) {
    io.sockets.volatile.emit('gameState', serializeState(state));
  });
  
};

