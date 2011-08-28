var gamejs = require('gamejs')
  , params = window.params
  , palmCoordinates = require('palm_coordinates').coords
  , rockCoordinates = require('rock_coordinates').coords
  , sandCoordinates = require('sand_coordinates').coords;

var drawImage = function(img, coordinates, surface, rect) {
  if (surface === undefined) {
    surface = new gamejs.Surface(params.gameWidth, params.gameHeight);
  }
  if (rect === undefined) {
      var size = img.getSize();
      rect = new gamejs.Rect([0,0],img.getSize());
  }
  
  _(coordinates).each(function(coord) {
    var x = coord[0]
      , y = coord[1]
      , r = coord[2];
    
    var x_ = Math.min(params.gameWidth - x, rect.width);
    var y_ = Math.min(params.gameHeight - y, rect.height);
    //var rotatedImage = gamejs.transform.rotate(img, r);
    var left = rect.left;
    var top = rect.top;
    var r_ = new gamejs.Rect([left, top], [x_,y_]);
    surface.blit(img, new gamejs.Rect([x+left, y+top],[x_,y_]), r_);
   });

   return surface;
};

var fillWithImage = function(img) {
  var x = 0
    , y = 0
    , w = img.getSize()[0]
    , h = img.getSize()[1];
    
  var surface = new gamejs.Surface(params.gameWidth, params.gameHeight);

  for (x = 0; x < params.gameWidth; x += w) {
    for (y = 0; y < params.gameHeight; y += h) {
      surface.blit(img, new gamejs.Rect([x, y]));
    }
  }

  return surface;
};

var Background = function() {
  var palmImage = gamejs.image.load("images/palm.png");
  var rect = new gamejs.Rect([0,0],[50,25]);
  this.palmSurface = drawImage(palmImage, palmCoordinates, undefined, rect);

  var grassImage = gamejs.image.load("images/grass_tile.png");
  this.grassSurface = fillWithImage(grassImage);

  var sandImage = gamejs.image.load("images/sand.png");
  drawImage(sandImage, sandCoordinates, this.grassSurface);

  var rockImage = gamejs.image.load("images/rock.png");
  drawImage(rockImage, rockCoordinates, this.grassSurface);

  rect = new gamejs.Rect([0,25],[50,22]);
  drawImage(palmImage, palmCoordinates, this.grassSurface, rect);

};

Background.prototype.drawPalms = function(mainSurface) {
  mainSurface.blit(this.palmSurface);
};

Background.prototype.drawGrass = function(mainSurface) {
  mainSurface.blit(this.grassSurface);
}

exports.Background = Background;
