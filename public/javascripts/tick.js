var gamejs = require('gamejs'),
	sprites = require('sprites');

var start = function(display, socket, gameInit) {
	var currentDirection = 0;
	var allAnimals = {};
	var projectiles = new gamejs.sprite.Group();
	var explosions = new gamejs.sprite.Group();
    var palms = [];
    var sands = [];
	
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
		if (key == gamejs.event.K_SPACE) {
			socket.emit('fire', function() {
				// do nothing
			});	
		} else {
			var direction = getDirectionValue(key);
		
			if (direction !== -1 && currentDirection !== direction) {
			  if (currentDirection !== -1) {
			    socket.emit('stopMoving', function() {
			      
			    });
			  }
			  
				currentDirection = direction;
			
				socket.emit('startMoving', direction, function() {
					// do nothing
				});
			}
		}
	};
	
	var handleKeyUp = function(key) {
		if (getDirectionValue(key) === currentDirection) {
			socket.emit('stopMoving', function() {
				currentDirection = -1;
			});
		}
	};
	
	var createPanda = function() {
		return new sprites.Panda();
	};
	
	var handlePanda = function(nick, x, y, dir, moving, health, score, alive) {
		$('#player-list').append($('<li>').text(nick + ": " + health + " - " + score));
		
		var panda = allAnimals[nick];
		if (panda === undefined) {
			panda = allAnimals[nick] = createPanda();
		}
		
		panda.updateState(x, y, dir, moving, alive);
		panda.setHealth(health);
	};
	
	var handleProjectile = function(x, y, dir) {
		var proj = new sprites.Projectile();
		proj.updateState(x, y, dir, true);
		projectiles.add(proj);
	};
	
	var handleExplosion = function(x, y) {
		explosions.add(new sprites.Bloodsplash([x, y]));
	};
	
	var handleGameState = function(state) {
		projectiles = new gamejs.sprite.Group();
		explosions  = new gamejs.sprite.Group();
		
        $('#player-list').empty();
		var allPandasInState = {};
		
		_(state.pa).each(function(panda) {
			handlePanda.apply(null, panda);
			allPandasInState[panda[0]] = true;
		});
  	_(state.pr).each(function(proj) {
  		handleProjectile.apply(null, proj);
  	});
    _(state.e).each(function(expl) {
      handleExplosion.apply(null, expl);
    });

		_(allAnimals).each(function(animals, nick) {
			if (allPandasInState[nick] === undefined) {
				delete allAnimals[nick];
			}
		});	  
	};
	
	socket.on('gameState', handleGameState);

	var grass = new gamejs.sprite.Group();
	var i, j;
	for (i = 0; i < 600; i += 15) {
		for (j = 0; j < 600; j += 15) {
			grass.add(new sprites.Grass([i, j]));
		}
	}
	
	var tick = function(msDuration) {
		var mainSurface = gamejs.display.getSurface();
		mainSurface.fill("#FFFFFF");
		
		grass.draw(mainSurface);
        _(sands).each(function(sand) {
            sand.draw(gamejs.display.getSurface())
        });
		projectiles.update(msDuration);
		projectiles.draw(mainSurface);
		
		var eventsByType = {};
		eventsByType[gamejs.event.KEY_DOWN] = [];
		eventsByType[gamejs.event.KEY_UP] = [];
		
		gamejs.event.get().forEach(function(e) {
			if (e.type == gamejs.event.KEY_DOWN || e.type == gamejs.event.KEY_UP) {
				eventsByType[e.type].push(e);
			}
		});
		
		if (eventsByType[gamejs.event.KEY_UP].length > 0) {
		  var e = eventsByType[gamejs.event.KEY_UP][0];
		  handleKeyUp(e.key);
		}
		
		if (eventsByType[gamejs.event.KEY_DOWN].length > 0) {
		  _(eventsByType[gamejs.event.KEY_DOWN]).each(function(e) {
		    handleKeyDown(e.key);
		  });
		}
		
		_(allAnimals).each(function(animal, animalId) {
			animal.update(msDuration);
			animal.draw(mainSurface);
		});
		
		
		explosions.draw(mainSurface);
        _(palms).each(function(palm) {
            palm.draw(gamejs.display.getSurface())
        });

	};
	handleGameState(gameInit);
	gamejs.time.fpsCallback(tick, this, 15);
    _(_.range(500)).each(function() {
        var x, y;
        x = Math.floor(Math.random() * params.gameWidth);
        y = Math.floor(Math.random() * params.gameHeight)
        palms.push(new sprites.Palm([x,y]));
    });
    _(_.range(20)).each(function() {
        var x, y;
        x = Math.floor(Math.random() * params.gameWidth);
        y = Math.floor(Math.random() * params.gameHeight)
        sands.push(new sprites.Sand([x,y]));
    });
};

exports.start = start;
