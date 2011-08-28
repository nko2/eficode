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
	};
	
	var processEvents = function() {
	  var byType = {};
		byType[gamejs.event.KEY_DOWN] = [];
		byType[gamejs.event.KEY_UP] = [];
		
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
		
		if (byType[gamejs.event.KEY_UP].length > 0) {
		  var e = byType[gamejs.event.KEY_UP][0];
		  onKeyUp(e.key);
		}
	};
	
	var tick = function(msDuration) {
	  processEvents();
	  
	  var mainSurface = gamejs.display.getSurface();
		game.update(msDuration);
		game.draw(mainSurface);
	};
	
	gamejs.time.fpsCallback(tick, this, 25);
};

exports.start = start;
