var gamejs = require('gamejs'),
	sprites = require('sprites');

var start = function(display, socket) {
	var currentDirection = 0;
	var allAnimals = {};
	
	var getDirectionValue = function(key) {
		switch (key) {
			case gamejs.event.K_UP:
				return 1;
				break;
				
			case gamejs.event.K_DOWN:
				return 2;
				break;
				
			case gamejs.event.K_LEFT:
				return 3;
				break;
				
			case gamejs.event.K_RIGHT:
				return 4;
				break;
				
			default:
				return -1;
		}
	};
	
	var handleKeyDown = function(key) {
		var direction = getDirectionValue(key);
		
		if (direction !== -1 && currentDirection !== direction) {
			currentDirection = direction;
			
			socket.emit('startMoving', direction, function() {
			
			});
		}
	};
	
	var handleKeyUp = function(key) {
		if (getDirectionValue(key) === currentDirection) {
			socket.emit('stopMoving', function() {
				console.log("stopped moving");
				currentDirection = -1;
			});
		}
	};
	
	var createAnimal = function(player) {
		if (player.type == "PANDA") {
			return new sprites.Panda([player.x, player.y]);
		} else {
			return null;
		}
	};
	
	socket.on('gameState', function(state) {
    $('#player-list').empty();

		_(state).each(function(player) {
      $('#player-list').append($('<li>').text(player.nick));

			if (allAnimals[player.nick] === undefined) {
				allAnimals[player.nick] = createAnimal(player);
			}
			
			allAnimals[player.nick].move(player.x, player.y, player.dir);
    });
  });
	
	var tick = function(msDuration) {
		var mainSurface = gamejs.display.getSurface();
		mainSurface.fill("#FFFFFF");
		
		gamejs.event.get().forEach(function(e) {
			if (e.type == gamejs.event.KEY_DOWN) {
				handleKeyDown(e.key);
			} else if (e.type == gamejs.event.KEY_UP) {
				handleKeyUp(e.key);
			}
		});
		
		_(allAnimals).each(function(animals, animalId) {
			allAnimals[animalId].draw(mainSurface);
		});
	};
	
	gamejs.time.fpsCallback(tick, this, 26);
};

exports.start = start;