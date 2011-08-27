$(function() {
  var socket = io.connect();

  socket.on('gameState', function(state) {
    $('#player-list').empty();
    _(state).each(function(player, nick) {
      $('#player-list').append($('<li>').text(nick));
    });
  });
  
  var startGame = function() {
    $('#login').hide();
    $('#players').show();
  };
  
  $('#start').click(function() {
    socket.emit('setnick', $('#nick').val(), function(ack) {
      startGame();
    });
  });
  
  
});