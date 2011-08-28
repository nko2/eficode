var params = require('./public/javascripts/params')
  , geometry = require('./geometry')
  , _ = require('underscore');

module.exports = {
  
  findCollidingPandas: function(panda, allPandas) {
    return _(allPandas).select(function(otherPanda) {
      if (panda === otherPanda) {
        return false;
      } else {
        return geometry.rectsIntersect(panda.x,      panda.y,      params.pandaWidth, params.pandaHeight,
                                       otherPanda.x, otherPanda.y, params.pandaWidth, params.pandaHeight);
      }
    });
  },
  
  forEachColliding: function(panda, allPandas, fn) {
    _(this.findCollidingPandas(panda, allPandas)).each(fn);
  },
  
  updatePandaPosition: function(pandaId, panda, allPandas) {
    var speed = params.Speed.PANDA;
    if (panda.alive !== 1) {
        panda.respawnTicks -= 1;
        if (panda.respawnTicks === 0) {
            respawnPanda(pandaId, panda);
        }
        return;
    }

    var xBefore = panda.x
      , yBefore = panda.y
      , delta = {};

    if (panda.moving) {
      switch (panda.dir) {
        case params.Direction.UP:
          panda.y = Math.max(panda.y - speed, 0);
          this.forEachColliding(panda, allPandas, function(collidingPanda) {
            panda.y = Math.max(panda.y, collidingPanda.y + params.pandaHeight);
          });
          break;
        case params.Direction.DOWN:
          panda.y = Math.min(panda.y + speed, params.gameHeight - params.pandaHeight);
          this.forEachColliding(panda, allPandas, function(collidingPanda) {
            panda.y = Math.min(panda.y + params.pandaHeight, collidingPanda.y) - params.pandaHeight;
          });
          break;
        case params.Direction.LEFT:
          panda.x = Math.max(panda.x - speed, 0);
          this.forEachColliding(panda, allPandas, function(collidingPanda) {
            panda.x = Math.max(panda.x, collidingPanda.x + params.pandaWidth);
          });
          break;
        case params.Direction.RIGHT:
          panda.x = Math.min(panda.x + speed, params.gameWidth - params.pandaWidth);
          this.forEachColliding(panda, allPandas, function(collidingPanda) {
            panda.x = Math.min(panda.x + params.pandaWidth, collidingPanda.x) - params.pandaWidth;
          });
          break;
      }
    }
    
    if (panda.x !== xBefore) delta.x = panda.x
    if (panda.y !== yBefore) delta.y = panda.y;
    return delta;
  },

  updateProjectilePosition: function(p) {
    var speed = params.Speed.PROJECTILE
      , xBefore = p.x
      , yBefore = p.y
      , delta = {};
      
    switch (p.dir) {
      case params.Direction.UP:    p.y -= speed; break;
      case params.Direction.DOWN:  p.y += speed; break;
      case params.Direction.LEFT:  p.x -= speed; break;
      case params.Direction.RIGHT: p.x += speed; break;
    }
    
    if (p.x !== xBefore) delta.x = p.x;
    if (p.y !== yBefore) delta.y = p.y;
    return delta;
  },

  updatePandaPositions: function(pandas) {
    var self = this
      , deltas = {};
    _(pandas).each(function(panda, id) {
      var delta = self.updatePandaPosition(id, panda, pandas);
      if (!_(delta).isEmpty()) {
        deltas[id] = delta;
      }
    });
    return deltas;
  },
  
  updateProjectilePositions: function(projectiles) {
    var self = this
      , deltas = {};
    _(projectiles).each(function(projectile, id) {
      var delta = self.updateProjectilePosition(projectile);
      if (!_(delta).isEmpty()) {
        deltas[id] = delta;
      }
    });
    return deltas;
  },
  
  findNewPosForPanda: function(pandas) {
    var maxX = params.gameWidth - params.pandaWidth
      , maxY = params.gameHeight - params.pandaHeight
      , tries = 0
      , x
      , y;
    do {
      x = Math.ceil(Math.random() * maxX);
      y = Math.ceil(Math.random() * maxY);
      tries += 1;
    } while (this.findCollidingPandas({x: x, y: y}, pandas).length > 0 && tries < 100);
    return {x: x, y: y};
  }
  
};



