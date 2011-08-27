$(function() {
  var socket = io.connect()
    , gameCanvas = new GameCanvas($('#game')[0], 400, 200);

  $(window).resize(_(gameCanvas.fitToWindow).bind(gameCanvas));
  
  socket.on('gameState', function(state) {
    $('#player-list').empty();
    _(state).each(function(player, nick) {
      $('#player-list').append($('<li>').text(nick));
    });
  });
  
  var startGame = function() {
    $('#login').hide();
    $('#main').show();
    gameCanvas.fitToWindow();
    gameCanvas.startRenderLoop();
  };
  
  $('#start').click(function() {
    socket.emit('join', $('#nick').val(), function() {
      startGame();
    });
  });
  
  
});