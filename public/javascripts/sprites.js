var gamejs = require('gamejs')
  , params = window.params;

/* ============================================================================
 * BaseElement
 * ============================================================================ */

var BaseElement = function() {
  BaseElement.superConstructor.apply(this, arguments);
  
  this.attrs = {};
  this.dir = params.Direction.NONE;
  this.changed = {};
  this.rect = new gamejs.Rect([0, 0]);
};
gamejs.utils.objects.extend(BaseElement, gamejs.sprite.Sprite);

BaseElement.prototype.get = function(attr) {
  return this.attrs[attr];
};

BaseElement.prototype.set = function(attr, val) {
  this.attrs[attr] = val;
  this.changed[attr] = true;
};

BaseElement.prototype.getType = function() {
  return this.type;
};

BaseElement.prototype.update = function(msDuration) {
  this.rect.left = this.get('x');
  this.rect.top  = this.get('y');
};

/* ============================================================================
 * Animated
 * ============================================================================ */

var Animated = function() {
	Animated.superConstructor.apply(this, arguments);
	this.images = [];
	this.currentImage = 0;
	this.ticksSinceLastImageChange = -2;
	
	return this;
};

gamejs.utils.objects.extend(Animated, BaseElement);

Animated.prototype.update = function(msDuration) {
  this.rect.left = this.get('x');
  this.rect.top  = this.get('y');
  
	if (this.get('moving') === 0) {
		this.image = this.imageGroups[this.get('dir')][0];
	} else {
    this.ticksSinceLastImageChange += 1;
      
    if (this.ticksSinceLastImageChange == 3 || this.changed['dir']) {
      var nextImage = this.currentImage + 1;
      
      if (nextImage >= this.imageGroups[this.get('dir')].length) {
        nextImage = 0;
      }

      this.image = this.imageGroups[this.get('dir')][nextImage];
      this.currentImage = nextImage;
      this.ticksSinceLastImageChange = 0;
    }
  }
};


/* ============================================================================
 * Panda
 * ============================================================================ */

var Panda = function() {
	Panda.superConstructor.apply(this, arguments);
	
	this.type = "PANDA";
	
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
  this.deadImage = gamejs.image.load("images/panda_sitting_right.png");
	
	this.imageGroups = [
		/* NONE */	[sittingDown, sittingUp, sittingDown, sittingLeft, sittingRight],
		/* UP */    [origUp1, origUp2, gamejs.transform.flip(origUp1, true)],
		/* DOWN */  [origDown1, origDown2, gamejs.transform.flip(origDown1, true)],
		/* LEFT */  [gamejs.transform.flip(origRight1, true), gamejs.transform.flip(origRight2, true)],
		/* RIGHT */ [origRight1, origRight2]
	];
};
gamejs.utils.objects.extend(Panda, Animated);

Panda.prototype.update = function(msDuration) {
  BaseElement.prototype.update.call(this, msDuration);
  
  if (!(this.get('alive'))) {
    this.image = this.deadImage;
  } else if (this.get('moving') === 0) {
    this.image = this.imageGroups[0][this.get('dir')];
  } else {
    Animated.prototype.update.call(this, msDuration);
  }
};

Panda.prototype.draw = function(mainSurface) {
  mainSurface.blit(this.image, this.rect);
  
  var hbWidth  = Math.floor(this.get('health') / 100 * 15);
  var hbHeight = 4;
  
  var srArray = new gamejs.surfacearray.SurfaceArray([hbWidth, hbHeight]);
  
  for (var x = 0; x < hbWidth; x++) {
    for (var y = 0; y < hbHeight; y++) {
      var color = [0, 255, 0];
      
      if (y == 0 || y == hbHeight-1 || x == 0 || x == hbWidth-1) {
        color = [0, 0, 0];
      }
      
      srArray.set(x, y, color);
    }
  }
  
  mainSurface.blit(srArray.surface, new gamejs.Rect([this.rect.left, this.rect.top-5]));
  return this;
};


/* ============================================================================
 * Projectile
 * ============================================================================ */

var Projectile = function() {
	Projectile.superConstructor.apply(this, arguments);
	
	this.type = "PROJECTILE";
  
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


/* ============================================================================
 * Bloodsplash
 * ============================================================================ */
 
var Bloodsplash = function() {
	Bloodsplash.superConstructor.apply(this, arguments);
	this.image = gamejs.image.load("images/blood_splash.png");
	this.type = "EXPLOSION";
	
};
gamejs.utils.objects.extend(Bloodsplash, BaseElement);


/* ============================================================================
 * Grass
 * ============================================================================ */

var Grass = function() {
	Grass.superConstructor.apply(this, arguments);
	this.image = gamejs.image.load("images/grass_tile.png");
	
	return this;
};
gamejs.utils.objects.extend(Grass, BaseElement);

exports.Panda = Panda;
exports.Grass = Grass;
exports.Projectile = Projectile;
exports.Bloodsplash = Bloodsplash;