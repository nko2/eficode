// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();
    
var GameCanvas = function(el, width, height) {
  this.el = el;
  this.el.width = width;
  this.el.height = height;
  this.ctx = el.getContext('2d');
};

GameCanvas.prototype.fitToWindow = function() {
  var areaWidth = $(window).width() - $('#sidebar').width() - 20
    , areaHeight = $(window).height()
    , resizeFactor = Math.min(areaWidth / this.el.width, areaHeight / this.el.height);
  $(this.el).css({
    width: this.el.width * resizeFactor,
    height: this.el.height * resizeFactor
  });
};

GameCanvas.prototype.clear = function() {
  this.ctx.save();
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  this.ctx.restore();
};


GameCanvas.prototype.draw = function() {
  this.clear();
  // Just draw something to test the animation
  var angle = new Date().getTime() % (Math.PI*2);
  this.ctx.save();
  this.ctx.fillRect(this.el.width/2 - 50 - Math.random() * 10, this.el.height/2 - 50 - Math.random() * 10, 100 + Math.random() * 10, 100 + Math.random() * 10);
  this.ctx.restore();
};

GameCanvas.prototype.startRenderLoop = function() {
  var self = this;
  (function renderLoop() {
    self.draw();
    requestAnimFrame(renderLoop, self.el);
  })();
};


