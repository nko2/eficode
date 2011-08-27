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
    nick: nick,
    x: params.gameWidth / 2,
    y: params.gameHeight / 2,
    dir: params.Direction.NONE,
    moving: 0,
    health: params.pandaStartHealth,
    score: 0
  };
};
game.playerLeft = function(id) {
  delete pandas[id];
};
game.playerStartedMoving = function(id, dir) {
  var panda = pandas[id];
  panda.dir = dir;
  panda.moving = 1;
};
game.playerStoppedMoving = function(id) {
  pandas[id]['moving'] = 0;
};
game.playerFired = function(id) {
  if (projectiles[id]) {
    return;
  }
  var panda = pandas[id]
    , projectileDimensions = getProjectileDimensions(panda.dir)
    , x = panda.x
    , y = panda.y;
  switch (panda.dir) {
    case params.Direction.UP: y -= projectileDimensions[1]; break;
    case params.Direction.DOWN: y += params.pandaHeight; break;
    case params.Direction.LEFT: x -= projectileDimensions[0]; break;
    case params.Direction.RIGHT: x += params.pandaWidth; break;
  }
  switch (panda.dir) {
      case params.Direction.UP: ;
      case params.Direction.DOWN: x += ((params.pandaWidth / 2) - (projectileDimensions[0] / 2));  break;
      default: y += ((params.pandaHeight / 2) - (projectileDimensions[1] / 2));break;
  }
  projectiles[id] = {x: Math.floor(x), y: Math.floor(y), dir: panda.dir, owner: id};
};

game.getState = function() {
  return {pandas: _(pandas).values(), projectiles: _(projectiles).values(), explosions: explosions};
};
game.getNicks = function() {
  return _(pandas).pluck('nick');
}

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
      , userId = coll[2]
      , shooter = pandas[proj.owner];
    delete projectiles[userId];
    explosions.push({x: panda.x, y: panda.y, age: 0});
    panda.health -= params.projectileDamage;
    if (panda.health <= 0) {
        if (shooter) {
            shooter.score += params.projectileKillScore;
        }
        panda.x = 1;
        panda.y = 1;
        panda.moving = 0;
    }
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
  movement.updatePositions(pandas, projectiles);
  detectExplosions();
  removeProjectilesOutsideGameArea();
  removeDistinguishedExplosions();

  game.emit('state', {pandas: _(pandas).values(), projectiles: _(projectiles).values(), explosions: explosions})

  setTimeout(gameLoop, 1000 / params.frameRate);
})();


module.exports = game;
