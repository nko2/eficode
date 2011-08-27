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
  var playerPos = movement.findNewPosForPanda(pandas);
   pandas[id] = {
    nick: nick,
    x: playerPos.x,
    y: playerPos.y,
    dir: params.Direction.NONE,
    moving: 0,
    health: params.pandaStartHealth,
    score: 0,
    alive: 1
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
  if (playerHasRecentlyFired(id)) {
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
  projectiles.push({x: Math.floor(x), y: Math.floor(y), dir: panda.dir, owner: id, firedAt: new Date().getTime()});
};

game.getState = function() {
  return {pandas: _(pandas).values(), projectiles: projectiles, explosions: explosions};
};
game.getNicks = function() {
  return _(pandas).pluck('nick');
}

function playerHasRecentlyFired(playerId) {
  var recent = new Date().getTime() - 1800;
  return _(projectiles).detect(function(proj) {
    return proj.owner === playerId && proj.firedAt > recent;
  });
}

function isInsideGameArea(el) {
  return el.x >= 0 && el.x <= params.gameWidth && el.y >= 0 && el.y <= params.gameHeight;
}

function removeProjectilesOutsideGameArea() {
  projectiles = _(projectiles).select(isInsideGameArea);
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
        collisions.push([panda, proj]);
      }
    });
  });
  _(collisions).each(function(coll) {
    var panda = coll[0]
      , proj = coll[1]
      , shooter = pandas[proj.owner];
    projectiles = _(projectiles).without(proj);
    explosions.push({x: panda.x, y: panda.y, age: 0});
    panda.health -= params.projectileDamage;
    if (panda.health <= 0) {
        killPanda(panda);
        if (shooter) {
            shooter.score += params.projectileKillScore;
        }
    }
  });
};

respawnPanda = function(panda) {
    panda.alive = 1;
    var newPos = movement.findNewPosForPanda(pandas);
    panda.x = newPos.x;
    panda.y = newPos.y;
    panda.moving = 0;
    panda.health = params.pandaStartHealth;
}

function killPanda(panda) {
    panda.alive = 0;
    panda.respawnTicks = params.respawnTicks;
}

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

  game.emit('state', {pandas: _(pandas).values(), projectiles: projectiles, explosions: explosions})

  setTimeout(gameLoop, 1000 / params.frameRate);
})();


module.exports = game;
