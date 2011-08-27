params = {
  gameWidth: 600,
  gameHeight: 600,
  pandaWidth: 15,
  pandaHeight: 15,
  pandaStartHealth: 100,
  projectileWidth: 15,
  projectileHeight: 5,
  projectileDamage: 35,
  projectileKillScore: 1,
  explosionDuration: 2000,
  Direction: {NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4},
  Speed: {PANDA: 6, PROJECTILE: 12},
  frameRate: 10
};


// Epic hack
if (typeof window === 'undefined') {
  module.exports = params;
}
