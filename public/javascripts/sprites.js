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
	this.moving = false;
	this.directionChanged = false;
	this.dir = -1;
	
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
};

Animated.prototype.update = function(msDuration) {
	if (this.moving === false) {
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
    }
};

var Panda = function() {
	Panda.superConstructor.apply(this, arguments);
	
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


var Projectile = function() {
	Projectile.superConstructor.apply(this, arguments);
	
	var orig1 = gamejs.image.load("images/flame_bolt_vert_1.png");
	var orig2 = gamejs.image.load("images/flame_bolt_vert_1.png");
	
	this.imageGroups = [
		/* NONE */	[orig1],
		/* UP */    [orig1, orig2],
		/* DOWN */  [orig1, orig2],
		/* LEFT */  [gamejs.transform.rotate(orig1, 90), gamejs.transform.rotate(orig2, 90)],
		/* RIGHT */ [gamejs.transform.rotate(orig1, 90), gamejs.transform.rotate(orig2, 90)]
	];
};
gamejs.utils.objects.extend(Projectile, Animated);

var Bloodsplash = function(rect) {
	Bloodsplash.superConstructor.apply(this, arguments);
	this.rect = new gamejs.Rect(rect);
	this.image = gamejs.image.load("images/blood_splash.png");
};

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
