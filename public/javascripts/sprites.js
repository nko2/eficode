var gamejs = require('gamejs');

/* ============================================================================
 * Animated
 * ============================================================================ */

var Animated = function() {
	Animated.superConstructor.apply(this, arguments);
	this.rect = new gamejs.Rect([0,0]);
	this.image = null;
	this.images = [];
	this.currentImage = -1;
	this.ticksSinceLastImageChange = -2;
	this.moving = 0;
	this.directionChanged = false;
	this.dir = -1;
	this.stateUpdated = false;
	this.health = 0;
	
	return this;
};
gamejs.utils.objects.extend(Animated, gamejs.sprite.Sprite);

Animated.prototype.updateState = function(x, y, dir, moving) {
	if (dir !== this.dir) {
		this.directionChanged = true;
		this.currentImage = -1;
	}
	
	this.rect.left = x;
	this.rect.top = y;
	this.dir = dir;
	this.moving = moving;
	this.statusUpdated = true;
};

Animated.prototype.update = function(msDuration) {
	if (this.moving === 0) {
		this.image = this.imageGroups[0][this.dir];
	} else {
        this.ticksSinceLastImageChange += 1;
        if (this.ticksSinceLastImageChange == 3 || this.directionChanged) {
            var nextImage = this.currentImage + 1;

            if (nextImage >= this.imageGroups[this.dir].length) {
                nextImage = 0;
            }

            this.image = this.imageGroups[this.dir][nextImage];
            this.currentImage = nextImage;
            this.ticksSinceLastImageChange = 0;
            this.directionChanged = false;
        }

        this.statusUpdated = false;
    }
};

var Panda = function() {
	Panda.superConstructor.apply(this, arguments);
  this.dir = 0;
	this.health = 0;
	
	var origRight1 = gamejs.image.load("images/panda_side_1.png");
	var origRight2 = gamejs.image.load("images/panda_side_2.png");
	var origUp1 = gamejs.image.load("images/panda_up_1.png");
	var origUp2 = gamejs.image.load("images/panda_up_2.png");
	var origDown1 = gamejs.image.load("images/panda_down_1.png");
	var origDown2 = gamejs.image.load("images/panda_down_2.png");
	var sittingDown = gamejs.image.load("images/panda_sitting_down.png");
	var sittingUp = gamejs.image.load("images/panda_sitting_up.png");
	var sittingRight = gamejs.image.load("images/panda_sitting_right.png");
	var sittingLeft = gamejs.transform.flip(sittingRight, true);
	
	this.imageGroups = [
		/* NONE */	[sittingDown, sittingUp, sittingDown, sittingLeft, sittingRight],
		/* UP */    [origUp1, origUp2, gamejs.transform.flip(origUp1, true)],
		/* DOWN */  [origDown1, origDown2, gamejs.transform.flip(origDown1, true)],
		/* LEFT */  [gamejs.transform.flip(origRight1, true), gamejs.transform.flip(origRight2, true)],
		/* RIGHT */ [origRight1, origRight2]
	];
};
gamejs.utils.objects.extend(Panda, Animated);

Panda.prototype.setHealth = function(health) {
  this.health = health;
};

Panda.prototype.draw = function(mainSurface) {
  mainSurface.blit(this.image, this.rect);
  
  var healthBarWidth = Math.floor(this.health / 100 * 15);
  console.log(healthBarWidth);
  var srArray = new gamejs.surfacearray.SurfaceArray([healthBarWidth, 4]);
  
  for (var x = 0; x < healthBarWidth; x++) {
    for (var y = 0; y < 4; y++) {
      var color = [0, 255, 0];
      
      if (y == 0 || y == 3 || x == 0 || x == healthBarWidth-1) {
        color = [0, 0, 0];
      }
      
      srArray.set(x, y, color);
    }
  }
  
  mainSurface.blit(srArray.surface, new gamejs.Rect([this.rect.left, this.rect.top-5]));
  return this;
};


var Projectile = function() {
	Projectile.superConstructor.apply(this, arguments);
	
	var origVertical1 = gamejs.image.load("images/flame_bolt_vert_1.png");
	var origVertical2 = gamejs.image.load("images/flame_bolt_vert_2.png");
	var origHorizontal1 = gamejs.image.load("images/flame_bolt_horizontal_1.png");
	var origHorizontal2 = gamejs.image.load("images/flame_bolt_horizontal_2.png");
	
	this.imageGroups = [
		/* NONE */	[origVertical1],
		/* UP */    [origVertical1, origVertical2],
		/* DOWN */  [origVertical1, origVertical2],
		/* LEFT */  [origHorizontal1, origHorizontal2],
		/* RIGHT */ [origHorizontal1, origHorizontal2]
	];
};
gamejs.utils.objects.extend(Projectile, Animated);

var Bloodsplash = function(rect) {
	Bloodsplash.superConstructor.apply(this, arguments);
	this.rect = new gamejs.Rect(rect);
	this.image = gamejs.image.load("images/blood_splash.png");
};
gamejs.utils.objects.extend(Bloodsplash, gamejs.sprite.Sprite);

var Grass = function(rect) {
	Grass.superConstructor.apply(this, arguments);
	this.rect = new gamejs.Rect(rect);
	this.image = gamejs.image.load("images/grass_tile.png");
	
	return this;
};
gamejs.utils.objects.extend(Grass, gamejs.sprite.Sprite);

exports.Panda = Panda;
exports.Grass = Grass;
exports.Projectile = Projectile;
exports.Bloodsplash = Bloodsplash;
