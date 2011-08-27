var game = require('./game');

module.exports = function(io) {

  io.sockets.on('connection', function(socket) {
    socket.on('join', function(nick, callback) {
      socket.set('nick', nick, function() {
        game.playerJoined(nick);
        callback();
      })
    });
    socket.on('disconnect', function() {
      socket.get('nick', function(err, nick) {
        game.playerLeft(nick);
      });
    });
  });

  game.on('state', function(state) {
    io.sockets.emit('gameState', state);
  });
  
};

