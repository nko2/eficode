var gamejs = require('gamejs')
  , sprites = require('sprites')
  , params = window.params
  , Background = require('pre_canvas').Background;

var Game = function(width, height, socket) {
  this.socket = socket;
  this.elements = {};
  this.currentDirection = params.Direction.NONE;
  this.background = new Background(); 
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
    this.socket.emit('startMoving', direction);
  }
};

Game.prototype.stopMoving = function() {
  this.socket.emit('stopMoving');
  this.currentDirection = params.Direction.NONE;
};

Game.prototype.fire = function() {
  this.socket.emit('fire');
};

Game.prototype.draw = function(mainSurface) {
  mainSurface.fill("#FFFFFF");	
  this.background.drawGrass(mainSurface);

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

  this.background.drawPalms(mainSurface);

  // Update score board
  $("#player-list").empty();
  
  _(byType["PANDA"]).each(function(panda) {
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
