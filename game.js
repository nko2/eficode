var evt = require('events')
  , _ = require('underscore')
  , params = require('./params')
  , geom = require('./geometry')
  , movement = require('./movement')
  , game = new evt.EventEmitter()
  , pandas = {}
  , projectiles = []
  , explosions = [];

game.playerJoined = function(id, nick) {
  pandas[id] = {
    type: 'PANDA',
    nick: nick,
    x: params.gameWidth / 2,
    y: params.gameHeight / 2,
    dir: params.Direction.NONE,
    moving: false
  };
};
game.playerLeft = function(id) {
  delete pandas[id];
};
game.playerStartedMoving = function(id, dir) {
  var panda = pandas[id];
  panda.dir = dir;
  panda.moving = true;
};
game.playerStoppedMoving = function(id) {
  pandas[id]['moving'] = false;
};
game.playerFired = function(id) {
  var panda = pandas[id];
  projectiles.push({type: 'PROJECTILE', x: panda.x, y: panda.y, dir: panda.dir});
};

function isInsideGameArea(el) {
  return el.x >= 0 && el.x <= params.gameWidth && el.y >= 0 && el.y <= params.gameHeight;
}

function removeProjectilesOutsideGameArea() {
  projectiles = _(projectiles).select(isInsideGameArea);
};

function getProjectileDimensions(proj) {
  var horizProj   = proj.dir === params.Direction.LEFT || proj.dir === params.Direction.RIGHT
    , dimensions = [projWidth, projHeight];
  return horizProj ? dimensions : dimensions.reverse();
};

function detectExplosions() {
  var collisions = [];
  _(projectiles).each(function(proj) {
    var projDim = getProjectileDimensions(proj);
    _(pandas).each(function (panda) {
      if (geom.isRectangleIntersection(proj.x, proj.y, projDim[0], projDim[1], panda.x, panda.y, params.pandaWidth, params.pandaHeight)) {
        collisions.push([panda, proj]);
      }
    });
  });
  _(collisions).each(function(coll) {
    var panda = coll[0]
      , proj = coll[1]
    projectiles = _(projectiles).without(proj);
    explosions.push({x: panda.x, y: panda.y, age: 0});
  });
};

function removeDistinguishedExplosions() {
  explosions = _(explosions).select(function(e) {
    if (e.age > params.explosionDuration) {
      return false;
    } else {
      e.age += 1000 / params.frameRate;
      return true;
    }
  });
}

(function gameLoop() {
  var pandasAndProjectiles = _(pandas).values().concat(projectiles);
  
  movement.updatePositions(pandasAndProjectiles);
  detectExplosions();
  removeProjectilesOutsideGameArea();
  removeDistinguishedExplosions();
  
  game.emit('state', pandasAndProjectiles.concat(explosions));
  
  setTimeout(gameLoop, 1000 / params.frameRate);
})();


module.exports = game;
