var gamejs = require('gamejs'),
	tick = require('tick');

$(document).ready(function() {
	var socket = io.connect();

	var main = function(gameInit) {
		$("#login").remove();
		$("#main").show();

		display = gamejs.display.setMode([600, 600]);
		tick.start(display, socket, gameInit);
	};

    function start() {
        socket.emit('join', $('#nick').val(), function(response) {
          if (response.status) {
            gamejs.preload(
                ["images/panda_side_1.png", "images/panda_side_2.png",
                 "images/panda_down_1.png", "images/panda_down_2.png",
                 "images/panda_up_1.png", "images/panda_up_2.png",
                 "images/panda_sitting.png",
                 "images/flame_bolt_vert_1.png", "images/flame_bolt_vert_2.png",
								 "images/flame_bolt_horizontal_1.png", "images/flame_bolt_horizontal_2.png",
                 "images/grass_tile.png",
								 "images/blood_splash.png"
            ]);
            gamejs.ready(function() {
              main(response.gameState);
            });
          } else {
            $("#login-fail").show();
          }
        });
    };

    $('#start').click(start);
    $('#nick').keyup(function(event){
        if(event.keyCode == 13) {
            start();
        };
    });
});
