var params = require('./params')
  , geometry = require('./geometry')
  , _ = require('underscore');

movement = {
  
  findCollidingPandas: function(panda, allPandas) {
    return _(allPandas).select(function(otherPanda) {
      if (panda === otherPanda) {
        return false;
      } else {
        return geometry.isRectangleIntersection(panda.x, panda.y, params.pandaWidth, params.pandaHeight,
                                                otherPanda.x, otherPanda.y, params.pandaWidth, params.pandaHeight);
      }
    });
  },
  
  forEachColliding: function(panda, allPandas, fn) {
    _(this.findCollidingPandas(panda, allPandas)).each(fn);
  },
  
  updatePandaPosition: function(panda, allPandas) {
    var speed = params.Speed.PANDA;
    if (panda.alive !== 1) {
        panda.respawnTicks -= 1;
        if (panda.respawnTicks === 0) {
            respawnPanda(panda);
        }
        return;
    }

    if (!panda.moving) return;

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
  },

  updateProjectilePosition: function(p) {
    var speed = params.Speed.PROJECTILE;
    switch (p.dir) {
      case params.Direction.UP:    p.y -= speed; break;
      case params.Direction.DOWN:  p.y += speed; break;
      case params.Direction.LEFT:  p.x -= speed; break;
      case params.Direction.RIGHT: p.x += speed; break;
    }
  },

  updatePositions: function(pandas, projectiles) {
    var self = this;
    _(pandas).each(function(panda) {
      self.updatePandaPosition(panda, pandas);
    });
    _(projectiles).each(this.updateProjectilePosition);
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
    } while (this.findCollidingPandas({x: x, y: y}, pandas).length > 0 && tries++ < 100);
    return {x: x, y: y};
  }
}

module.exports = movement;


