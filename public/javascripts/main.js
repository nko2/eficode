var gamejs = require('gamejs'),
	tick = require('tick');


var main = function() {
	$("#login").hide();
	$("#main").show();
	
	var resizeToFitWindow = function() {
		var canvas = $("#gjs-canvas")[0];
		
		var areaWidth = $(window).width() - $('#sidebar').width() - 20
	    , areaHeight = $(window).height()
	    , resizeFactor = Math.min(areaWidth / canvas.width, areaHeight / canvas.height);
	  
	  $(canvas).css({
	    width: canvas.width * resizeFactor,
	    height: canvas.height * resizeFactor
	  });
	};
	
				
	display = gamejs.display.setMode([400, 400]);
	resizeToFitWindow();
		
	tick.start(display);
};

$(document).ready(function() {
	var socket = io.connect();
	
	socket.on('gameState', function(state) {
    $('#player-list').empty();
    _(state).each(function(player, nick) {
      $('#player-list').append($('<li>').text(nick));
    });
  });
	
	$('#start').click(function() {
    socket.emit('join', $('#nick').val(), function() {
      gamejs.preload([]);
			gamejs.ready(main);
    });
  });
});