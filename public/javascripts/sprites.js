var gamejs = require('gamejs');

var Animal = function(rect) {
	Animal.superConstructor.apply(this, arguments);
	this.rect = new gamejs.Rect(rect);
	this.image = null;
	this.images = [];
	
	return this;
};
gamejs.utils.objects.extend(Animal, gamejs.sprite.Sprite);

Animal.prototype.setDirection = function(val) {
	this.image = this.images[val];
};

Animal.prototype.move = function(x, y, dir) {
	this.setDirection(dir);
	this.rect.left = x;
	this.rect.top = y;
};

var Panda = function(rect) {
	Panda.superConstructor.apply(this, arguments);
	this.images[0] = gamejs.image.load("images/panda_sitting.png");
	this.images[1] = gamejs.image.load("images/panda_up.png");
	this.images[2] = gamejs.image.load("images/panda_down.png");
	this.images[3] = gamejs.image.load("images/panda_left.png");
	this.images[4] = gamejs.image.load("images/panda_right.png");
};
gamejs.utils.objects.extend(Panda, Animal);


var Grass = function(rect) {
	Grass.superConstructor.apply(this, arguments);
	this.rect = new gamejs.Rect(rect);
	this.image = gamejs.image.load("images/grass_tile.png");
	
	return this;
};
gamejs.utils.objects.extend(Grass, gamejs.sprite.Sprite);

exports.Panda = Panda;
exports.Grass = Grass;