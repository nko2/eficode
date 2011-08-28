var gamejs = require('gamejs')
  , params = window.params
  , palmCoordinates = require('palm_coordinates').coords
  , sandCoordinates = require('sand_coordinates').coords;

var drawImage = function(img, coordinates, surface) {
  if (surface === undefined) {
    surface = new gamejs.Surface(params.gameWidth, params.gameHeight);
  }
  
  _(coordinates).each(function(coord) {
    var x = coord[0]
      , y = coord[1];
    
    surface.blit(img, new gamejs.Rect([x, y]));
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
  this.palmSurface = drawImage(palmImage, palmCoordinates);
  
  var grassImage = gamejs.image.load("images/grass_tile.png");
  this.grassSurface = fillWithImage(grassImage);
  
  var sandImage = gamejs.image.load("images/sand.png");
  drawImage(sandImage, sandCoordinates, this.grassSurface);
};

Background.prototype.drawPalms = function(mainSurface) {
  mainSurface.blit(this.palmSurface);
};

Background.prototype.drawGrass = function(mainSurface) {
  mainSurface.blit(this.grassSurface);
}

exports.Background = Background;
