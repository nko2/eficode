$(function() {
  var socket = io.connect()
    , canvas = $('#game')[0]
    , ctx = canvas.getContext('2d')
    , gameWidth = 400
    , gameHeight = 200;

  canvas.width = gameWidth;
  canvas.height = gameHeight;
  ctx.fillRect(10, 10, gameWidth - 20, gameHeight - 20);
  
  fitGameAreaToWindow = function() {
    var areaWidth = $(window).width() - $('#sidebar').width() - 20
      , areaHeight = $(window).height()
      , resizeFactor = Math.min(areaWidth / gameWidth, areaHeight / gameHeight);
    $(canvas).css({width: gameWidth * resizeFactor, height: gameHeight * resizeFactor});
  };
  $(window).resize(fitGameAreaToWindow)
  
  socket.on('gameState', function(state) {
    $('#player-list').empty();
    _(state).each(function(player, nick) {
      $('#player-list').append($('<li>').text(nick));
    });
  });
  
  var startGame = function() {
    $('#login').hide();
    $('#main').show();
    fitGameAreaToWindow();
  };
  
  $('#start').click(function() {
    socket.emit('join', $('#nick').val(), function() {
      startGame();
    });
  });
  
  
});