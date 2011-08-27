// Epic hack pt.1
if (typeof window === 'undefined') {
  params = require('./params');
  _ = require('underscore');
}

movement = {
  updatePandaPosition: function(panda) {
    if (!panda.moving) return;
  
    var speed = params.Speed.PANDA;
    switch (panda.dir) {
      case params.Direction.UP:
        panda.y = Math.max(panda.y - speed, 0);
        break;
      case params.Direction.DOWN:
        panda.y = Math.min(panda.y + speed, params.gameHeight - params.pandaHeight);
        break;
      case params.Direction.LEFT:
        panda.x = Math.max(panda.x - speed, 0);
        break;
      case params.Direction.RIGHT:
        panda.x = Math.min(panda.x + speed, params.gameWidth - params.pandaWidth);
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

  updatePositions: function(state) {
    var self = this;
    _(state).each(function(el) {
      if (el.type === 'PANDA') {
        self.updatePandaPosition(el);
      } else if (el.type === 'PROJECTILE') {
        self.updateProjectilePosition(el);
      }
    });
  }
}

// Epic hack pt.2
if (typeof window === 'undefined') {
  module.exports = movement;
}


