var gamejs = require('gamejs')
  , sprites = require('sprites')
	, utils = require('utils')
	, Game = require('game').Game
	, params = window.params;

var start = function(display, socket) {
  socket.on('gameStateDelta', function(state) {
	  game.updateState(state);
	});
	
	var game = new Game(params.gameWidth, params.gameHeight, socket);
  socket.emit('startGame', function(gameInit) {
  	game.updateState(gameInit);
  });
	
	var onKeyDown = function(key) {
		if (key == gamejs.event.K_SPACE) {
			game.fire();
		} else {
			var direction = utils.keyToDirection(key);
		  game.changeDirection(direction);
		}
	};
	
	var onKeyUp = function(key) {
		if (utils.keyToDirection(key) === game.currentDirection) {
			game.stopMoving();
		}
//<<<<<<< Updated upstream
	};
	
    var ageNotification = function(notification) {
      notification.ticksToLive -= 1;
    }

	var processEvents = function() {
	  var byType = {};
		byType[gamejs.event.KEY_DOWN] = [];
		byType[gamejs.event.KEY_UP] = [];
//=======
		
		//panda.updateState(x, y, dir, moving, alive);
		//panda.setHealth(health);
	//};
	
	//var handleProjectile = function(x, y, dir) {
		//var proj = new sprites.Projectile();
		//proj.updateState(x, y, dir, true);
		//projectiles.add(proj);
	//};
	
	//var handleExplosion = function(x, y) {
		//explosions.add(new sprites.Bloodsplash([x, y]));
	//};
	
	//var grass = new gamejs.sprite.Group();
	//var i, j;
	//for (i = 0; i < params.gameWidth; i += 15) {
		//for (j = 0; j < params.gameHeight; j += 15) {
			//grass.add(new sprites.Grass([i, j]));
		//}
	//}
	
	//var tick = function(msDuration) {
		//var mainSurface = gamejs.display.getSurface();
		//mainSurface.fill("#FFFFFF");
		
		//grass.draw(mainSurface);
        //_(sands).each(function(sand) {
            //sand.draw(gamejs.display.getSurface())
        //});
		//projectiles.update(msDuration);
		//projectiles.draw(mainSurface);
		
		//var eventsByType = {};
		//eventsByType[gamejs.event.KEY_DOWN] = [];
		//eventsByType[gamejs.event.KEY_UP] = [];
//>>>>>>> Stashed changes
		
		gamejs.event.get().forEach(function(e) {
			if (e.type == gamejs.event.KEY_DOWN || e.type == gamejs.event.KEY_UP) {
				byType[e.type].push(e);
			}
		});
		
		if (byType[gamejs.event.KEY_DOWN].length > 0) {
		  _(byType[gamejs.event.KEY_DOWN]).each(function(e) {
		    onKeyDown(e.key);
		  });
		}
		
//<<<<<<< Updated upstream
		if (byType[gamejs.event.KEY_UP].length > 0) {
		  var e = byType[gamejs.event.KEY_UP][0];
		  onKeyUp(e.key);
		}
//=======
		//_(allAnimals).each(function(animal, animalId) {
			//animal.update(msDuration);
			//animal.draw(mainSurface);
		//});
		

		//explosions.draw(mainSurface);
        //_(palms).each(function(palm) {
            //palm.draw(gamejs.display.getSurface())
        //});

//>>>>>>> Stashed changes
	};
	
    var tick = function(msDuration) {
      processEvents();

      var mainSurface = gamejs.display.getSurface();
      game.update(msDuration);
      game.draw(mainSurface);
      if (game.notifications.length > 0) {
        game.writeNotifications();
      }
      console.log("Doing stuff to notifications");
      // Remove old notifications
      console.log(game.notifications.length);
      game.notifications = _(game.notifications).reject(function (notification) {
        console.log(notification.ticksToLive);
        return notification.ticksToLive < 0;
      });
      console.log(game.notifications.length);
      _(game.notifications).each(function(notification) {
        ageNotification(notification);
      });
    }

    gamejs.time.fpsCallback(tick, this, 25);
};

exports.start = start;
