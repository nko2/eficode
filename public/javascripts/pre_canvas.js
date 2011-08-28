var gamejs = require('gamejs')
  , params = window.params
  , palmCoordinates = require('palm_coordinates')
  , sandCoordinates = require('sand_coordinates');

var drawImage = function(img, coordinates) {
  var surface = new gamejs.Surface(params.gameWidth, params.gameHeight);

  _(coordinates).each(function(coord) {
    surface.blit(img, [coord[0], coord[1]], [img.getSize()[0], img.getSize()[1]]);
   });

   return surface;
};

var fillWithImage = function(img) {
  var x = 0
    , y = 0
    , w = img.getSize()[0]
    , h = img.getSize()[1];

  var surface = new gamejs.Surface(params.gameWidth, params.gameHeight);

  for (; x < params.gameWidth; x += w) {
    for (; y < params.gameHeight; y += h) {
      surface.blit(img, [x, y], [w, h]);
    }
  }

  return surface;
};

var Background = function() {
  /*
  var palmImage = gamejs.image.load("images/palm.png");
  this.palmSurface = drawImage(palmImage, palmCoordinates);

  var sandImage = gamejs.image.load("images/sand.png");
  this.sandSurface = drawImage(sandImage, sandCoordinates);
*/
  var grassImage = gamejs.image.load("images/grass_tile.png");
  this.grassSurface = fillWithImage(grassImage);
};

Background.drawPalms = function(mainSurface) {
  //mainSurface.blit(this.palmSurface);
};

Background.drawSand = function(mainSurface) {
  //mainSurface.blit(this.sandSurface);
};

Background.drawGrass = function(mainSurface) {
  mainSurface.blit(this.grassSurface);
}

exports.Background = Background;
