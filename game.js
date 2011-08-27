var evt = require('events')
  , _ = require('underscore')
  , params = require('./params')
  , geom = require('./geometry')
  , movement = require('./movement')
  , game = new evt.EventEmitter()
  , pandas = {}
  , projectiles = {}
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
  if (projectiles[id]) {
    return;
  }
  var panda = pandas[id]
    , x = panda.x
    , y = panda.y;
  switch (panda.dir) {
    case params.Direction.DOWN: y = panda.y + params.pandaHeight; break;
    case params.Direction.RIGHT: x = panda.x + params.pandaWidth; break;
  }
  projectiles[id] = {type: 'PROJECTILE', x: x, y: y, dir: panda.dir};
};

function isInsideGameArea(el) {
  return el.x >= 0 && el.x <= params.gameWidth && el.y >= 0 && el.y <= params.gameHeight;
}

function removeProjectilesOutsideGameArea() {
  projectiles = _(projectiles).reduce(function(res, proj, id) {
    if (isInsideGameArea(proj)) {
      res[id] = proj;
    }
    return res;
  }, {});
  console.log(projectiles);
};

function getProjectileDimensions(dir) {
  var horizProj   = dir === params.Direction.LEFT || dir === params.Direction.RIGHT
    , dimensions = [params.projectileWidth, params.projectileHeight];
  return horizProj ? dimensions : dimensions.reverse();
};

function detectExplosions() {
  var collisions = [];
  _(projectiles).each(function(proj, userId) {
    var projDim = getProjectileDimensions(proj.dir);
    _(pandas).each(function (panda) {
      if (geom.isRectangleIntersection(proj.x, proj.y, projDim[0], projDim[1], panda.x, panda.y, params.pandaWidth, params.pandaHeight)) {
        collisions.push([panda, proj, userId]);
      }
    });
  });
  _(collisions).each(function(coll) {
    var panda = coll[0]
      , proj = coll[1]
      , userId = coll[2];
    delete projectiles[userId];
    explosions.push({type: 'EXPLOSION', x: panda.x, y: panda.y, age: 0});
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
  var pandasAndProjectiles = _(pandas).values().concat(_(projectiles).values());
  
  movement.updatePositions(pandasAndProjectiles);
  detectExplosions();
  removeProjectilesOutsideGameArea();
  removeDistinguishedExplosions();
  
  game.emit('state', pandasAndProjectiles.concat(explosions));
  
  setTimeout(gameLoop, 1000 / params.frameRate);
})();


module.exports = game;
