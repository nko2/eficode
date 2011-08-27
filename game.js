var evt = require('events')
  , _ = require('underscore')
  , gameWidth = 600, gameHeight = 600
  , pandaWidth = 15, pandaHeight = 15
  , projectileWidth = 10, projectileHeight = 5
  , explosionDuration = 2000
  , Direction = {NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4}
  , Speed = {PANDA: 10, PROJECTILE: 20}
  , frameRate = 25
  , game = new evt.EventEmitter()
  , pandas = {}
  , projectiles = []
  , explosions = [];

game.playerJoined = function(id, nick) {
  pandas[id] = {
    type: 'PANDA',
    nick: nick,
    x: gameWidth / 2,
    y: gameHeight / 2,
    dir: Direction.NONE,
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

function updatePandaPosition(panda) {
  if (!panda.moving) return;
  
  var speed = Speed.PANDA;
  switch (panda.dir) {
    case Direction.UP:
      panda.y = Math.max(panda.y - speed, 0);
      break;
    case Direction.DOWN:
      panda.y = Math.min(panda.y + speed, gameHeight - pandaHeight);
      break;
    case Direction.LEFT:
      panda.x = Math.max(panda.x - speed, 0);
      break;
    case Direction.RIGHT:
      panda.x = Math.min(panda.x + speed, gameWidth - pandaWidth);
      break;
  }
};

function updateProjectilePosition(p) {
  var speed = Speed.PROJECTILE;
  switch (p.dir) {
    case Direction.UP:    p.y -= speed; break;
    case Direction.DOWN:  p.y += speed; break;
    case Direction.LEFT:  p.x -= speed; break;
    case Direction.RIGHT: p.x += speed; break;
  }
};

function isInsideGameArea(el) {
  return el.x >= 0 && el.x <= gameWidth && el.y >= 0 && el.y <= gameHeight;
}

function updatePositions() {
  _(pandas).each(updatePandaPosition);
  _(projectiles).each(updateProjectilePosition);
  projectiles = _(projectiles).select(isInsideGameArea);
};

function getProjectileDimensions(proj) {
  var horizProj   = proj.dir === Direction.LEFT || proj.dir === Direction.RIGHT
    , projWidth   = (horizProj ? projectileWidth : projectileHeight)
    , projHeight  = (horizProj ? projectileHeight : projectileWidth);
  return [projWidth, projHeight];  
};

function isRectangleIntersection(x1, y1, width1, height1, x2, y2, width2, height2) {
  return x1 < x2 + width2 &&
         x1 + width1 > x2 &&
         y1 < y2 + height2 &&
         y1 + height1 > height2;
}

function detectExplosions() {
  var collisions = [];
  _(projectiles).each(function(proj) {
    var projectileDimensions = getProjectileDimensions(proj)
      , projWidth = projectileDimensions[0]
      , projHeight = projectileDimensions[1];
    _(pandas).each(function (panda) {
      if (isRectangleIntersection(proj.x, proj.y, projWidth, projHeight, panda.x, panda.y, pandaWidth, pandaHeight)) {
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
    if (e.age > explosionDuration) {
      return false;
    } else {
      e.age += 1000 / frameRate;
      return true;
    }
  });
}

(function gameLoop() {
  updatePositions();
  detectExplosions();
  removeDistinguishedExplosions();
  
  var state = _(pandas).values().concat(projectiles).concat(explosions);
  game.emit('state', state);
  
  setTimeout(gameLoop, 1000 / frameRate);
})();


module.exports = game;
