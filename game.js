var evt = require('events')
  , _ = require('underscore')
  , uid = require('./uid')
  , params = require('./params')
  , geom = require('./geometry')
  , movement = require('./movement')
  , game = new evt.EventEmitter()
  , pandas = {}
  , newPandas = {}
  , removedPandas = []
  , pandaMovementCommands = []
  , projectiles = {}
  , newProjectiles = {}
  , removedProjectiles = []
  , explosions = {}
  , newExplosions = {};

game.playerJoined = function(id, nick) {
  var playerPos = movement.findNewPosForPanda(pandas);
  newPandas[id] = {
    nick: nick,
    x: playerPos.x,
    y: playerPos.y,
    dir: params.Direction.NONE,
    moving: 0,
    health: params.pandaStartHealth,
    score: 0
  };
};
game.playerLeft = function(id) {
  removedPandas.push(id);
};
game.playerStartedMoving = function(id, dir) {
  pandaMovementCommands.push({id: id, moving: 1, dir: dir});
};
game.playerStoppedMoving = function(id) {
  pandaMovementCommands.push({id: id, moving: 0});
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
    case params.Direction.UP: y -= projectileDimensions.height; break;
    case params.Direction.DOWN: y += params.pandaHeight; break;
    case params.Direction.LEFT: x -= projectileDimensions.width; break;
    case params.Direction.RIGHT: x += params.pandaWidth; break;
  }
  switch (panda.dir) {
      case params.Direction.UP: ;
      case params.Direction.DOWN: x += ((params.pandaWidth / 2) - (projectileDimensions.width / 2));  break;
      default: y += ((params.pandaHeight / 2) - (projectileDimensions.height / 2));break;
  }
  newProjectiles[uid()] = {x: Math.floor(x), y: Math.floor(y), dir: panda.dir, owner: id, firedAt: new Date().getTime()};
};

game.getState = function() {
  return {
    newElements: {
      PANDA: pandas,
      PROJECTILE: projectiles,
      EXPLOSION: explosions
    }
  };
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
  var removedIds = [];
  projectiles = _(projectiles).reduce(function(memo, proj, id) {
    if (isInsideGameArea(proj)) {
      memo[id] = proj;
    } else {
      removedIds.push(id);
    }
    return memo;
  }, {});
  return removedIds;
};

function getProjectileDimensions(dir) {
  var horizProj   = dir === params.Direction.LEFT || dir === params.Direction.RIGHT
    , dimensions = {width: params.projectileWidth, height: params.projectileHeight};
  return horizProj ? dimensions : {width: dimensions.height, height: dimensions.width};
};

function applyProjectileCollisions() {
  var collisions = [];
  _(projectiles).each(function(proj, id) {
    var projDim = getProjectileDimensions(proj.dir);
    _(pandas).each(function (panda) {
      if (geom.isRectangleIntersection(proj.x, proj.y, projDim.width, projDim.height,
                                       panda.x, panda.y, params.pandaWidth, params.pandaHeight)) {
        collisions.push([panda, proj, id]);
      }
    });
  });
  _(collisions).each(function(coll) {
    var panda = coll[0]
      , proj = coll[1]
      , id = coll[2]
      , shooter = pandas[proj.owner];
    removedProjectiles.push(id);
    newExplosions[uid()] = {x: panda.x, y: panda.y, age: 0};
    panda.health -= params.projectileDamage;
    if (panda.health <= 0) {
        var newPos = movement.findNewPosForPanda(pandas);
        if (shooter) {
            shooter.score += params.projectileKillScore;
        }
        panda.x = newPos.x;
        panda.y = newPos.y;
        panda.moving = 0;
        panda.health = params.pandaStartHealth;
    }
  });
};

function removeDistinguishedExplosions() {
  var removedIds = [];
  explosions = _(explosions).reduce(function(memo, expl, id) {
    if (expl.age <= params.explosionDuration) {
      expl.age += 1000 / params.frameRate;
      memo[id] = expl
    } else {
      removedIds.push(id);
    }
    return memo;
  }, {});
  return removedIds;
}

function applyRemovedElements() {
  var removedElements = [];
  
  removedElements.concat(removedProjectiles);
  removedElements.concat(removeProjectilesOutsideGameArea());
  removedElements.concat(removeDistinguishedExplosions());
  removedElements.concat(removedPandas);
  
  _(removedPandas).each(function(id) {
    delete pandas[id];
  });
  removedPandas = [];
  removedProjectiles = [];
  
  return removedElements;
}

function applyNewElements() {
  var newElements = {};
  
  if (!_(newPandas).isEmpty())      newElements['PANDA'] = newPandas;
  if (!_(newProjectiles).isEmpty()) newElements['PROJECTILE'] = newProjectiles;
  if (!_(newExplosions).isEmpty())  newElements['EXPLOSION'] = newExplosions;
  
  _(pandas).extend(newPandas);
  newPandas = {};
  _(projectiles).extend(newProjectiles);
  newProjectiles = {};
  _(explosions).extend(newExplosions);
  newExplosions = {};

  return newElements;
}

function applyMovements() {
  var deltas = {};
  
  _(pandaMovementCommands).each(function(cmd) {
    if (!deltas[cmd.id]) deltas[cmd.id] = {};
    deltas[cmd.id]['moving'] = cmd.moving;
    pandas[cmd.id]['moving'] = cmd.moving;
    if (cmd.dir) {
      deltas[cmd.id]['dir'] = cmd.dir;
      pandas[cmd.id]['dir'] = cmd.dir;
    }
  });
  pandaMovementCommands = [];
  
  var pandaPositionUpdates = movement.updatePandaPositions(pandas);
  _(pandaPositionUpdates).each(function(update, id) {
    if (!deltas[id]) deltas[id] = {};
    _(deltas[id]).extend(update);
  });
  
  var projectilePositionUpdates = movement.updateProjectilePositions(projectiles);
  _(projectilePositionUpdates).each(function(update, id) {
    if (!deltas[id]) deltas[id] = {};
    _(deltas[id]).extend(update);
  });
  
  return deltas;
}

(function gameLoop() {
  applyProjectileCollisions();
  
  var stateDelta = {};
  
  var removedElements = applyRemovedElements();
  if (!_(removedElements).isEmpty()) stateDelta['removedElements'] = removedElements;
    
  var newElements = applyNewElements();
  if (!_(newElements).isEmpty()) stateDelta['newElements'] = newElements;

  var deltas = applyMovements();
  if (!_(deltas).isEmpty()) stateDelta['deltas'] = deltas;
  
  if (!_(stateDelta).isEmpty()) {
    game.emit('stateDelta', stateDelta);
  }

  setTimeout(gameLoop, 1000 / params.frameRate);
})();


module.exports = game;
