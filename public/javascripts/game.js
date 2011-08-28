var gamejs = require('gamejs')
  , sprites = require('sprites')
  , params = window.params;

var createLawn = function(width, height) {
  var lawn = new gamejs.sprite.Group();
  
	var i, j;
	for (i = 0; i < width; i += 15) {
		for (j = 0; j < height; j += 15) {
			var tile = new sprites.Grass();
			tile.set('x', i);
			tile.set('y', j);
			
			lawn.add(tile);
		}
	}
	
	// Required for BaseElement to set rectangle
	lawn.update(0);
	
	return lawn;
};

var Game = function(width, height, socket) {
  this.socket = socket;
  this.elements = {};
  this.currentDirection = params.Direction.NONE;
  this.lawn = createLawn(width, height);
};

Game.prototype.update = function(msDuration) {
  _(this.elements).each(function(el) {
    el.update(msDuration);
  });
};

Game.prototype.changeDirection = function(direction) {  
  if (direction == -1) {
    return;
  }
  
  if (direction !== this.currentDirection) {
    if (this.currentDirection !== params.Direction.NONE) {
      this.stopMoving();
    }
    
    this.currentDirection = direction;
    this.socket.emit('startMoving', direction, function() { });
  }
};

Game.prototype.stopMoving = function() {
  this.socket.emit('stopMoving', function() { });
  this.currentDirection = params.Direction.NONE;
};

Game.prototype.fire = function() {
  this.socket.emit('fire', function() { });
};

Game.prototype.draw = function(mainSurface) {
	mainSurface.fill("#FFFFFF");	
  this.lawn.draw(mainSurface);
  
  // Group all elements by type
  var byType = { EXPLOSION : [], PROJECTILE: [], PANDA: [], PALM: [] };
  _(this.elements).each(function(el, id) {
    byType[el.getType()].push(el);
  });
  
  // Draw in correct order
  _(["PROJECTILE", "PANDA", "EXPLOSION", "PALM"]).each(function(type) {
    _(byType[type]).each(function(el) {
      el.draw(mainSurface);
    });
  });
  
  // Update score board
  _(byType["PANDA"]).each(function(panda) {
    $("#player-list").empty();
    $('#player-list').append($('<li>').text(panda.get('nick') + ": " + panda.get('score')));
  });
};

Game.prototype.updateState = function(state) {
  var that = this;
  
  var createElement = function(type) {
    switch (type) {
      case "PANDA":
        return new sprites.Panda();
        
      case "EXPLOSION":
        return new sprites.Bloodsplash();
        
      case "PROJECTILE":
        return new sprites.Projectile();
    }
  };
  
  var updateElement = function(el, deltaUpdates) {
    _(deltaUpdates).each(function(val, attr) {
      el.set(attr, val);
    });
  };
  
  if (state.newElements !== undefined) {
    _(state.newElements).each(function(elements, type) {
      _(elements).each(function(elData, id) {
        var el = createElement(type);
        updateElement(el, elData);
      
        that.elements[id] = el;
      });
    });
  }
  
  if (state.deltas !== undefined) {
    _(state.deltas).each(function(deltaUpdates, id) {
      var el = that.elements[id];
      updateElement(el, deltaUpdates);
    });
  }
  
  if (state.removedElements !== undefined) {
    _(state.removedElements).each(function(id) {
      delete that.elements[id];
    });
  }
  
};

exports.Game = Game;
