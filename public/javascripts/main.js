var gamejs = require('gamejs'),
	tick = require('tick');

$(document).ready(function() {
	var socket = io.connect();
	
	var main = function() {
		$("#login").hide();
		$("#main").show();

		display = gamejs.display.setMode([600, 600]);
		tick.start(display, socket);
	};
	
	$('#start').click(function() {
    socket.emit('join', $('#nick').val(), function() {
      gamejs.preload(["images/panda_sitting.png", "images/panda_up.png", "images/panda_down.png", "images/panda_left.png", "images/panda_right.png"]);
			gamejs.ready(main);
    });
  });
});