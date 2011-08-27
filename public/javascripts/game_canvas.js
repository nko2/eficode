var GameCanvas = function(el, width, height) {
  this.el = el;
  this.el.width = width;
  this.el.height = height;
  this.ctx = el.getContext('2d');
  this.ctx.fillRect(10, 10, this.el.width - 20, this.el.height - 20);
};

GameCanvas.prototype.fitToWindow = function() {
  var areaWidth = $(window).width() - $('#sidebar').width() - 20
    , areaHeight = $(window).height()
    , resizeFactor = Math.min(areaWidth / this.el.width, areaHeight / this.el.height);
  $(this.el).css({width: this.el.width * resizeFactor, height: this.el.height * resizeFactor});
};

