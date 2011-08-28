var geometry = {
  rectsIntersect: function(x1, y1, width1, height1, x2, y2, width2, height2) {
    return x1 < x2 + width2 &&
           x1 + width1 > x2 &&
           y1 < y2 + height2 &&
           y1 + height1 > y2;
  },
  
  rayIntersectsEdge: function(pt, edge) {
    var aX = edge[0][0]
      , aY = edge[0][1]
      , bX = edge[1][0]
      , bY = edge[1][1]
      , pX = pt[0]
      , pY = pt[1]
      , epsilon = Math.pow(10, -5)
      , mRed
      , mBlue;
        
    if (aY > bY) {
      var cX = bX;
      var cY = bY;
      bX = aX;
      bY = aY;
      aX = cX;
      aY = cY;
    }
    if (pY === aY || pY === bY) {
      pY += epsilon;
    }
      
    if (pY > bY || pY < aY || (pX > Math.max(aX, bX))) {
      return false;
    } else if (pX < Math.min(aX, bX)) {
      return true;
    } else {
      if (Math.abs(aX - bX) > epsilon) {
        mRed = (bY - aY) / (bX - aX)
      } else {
        mRed = Math.pow(10, 10);
      }
      if (Math.abs(aX - pX) > epsilon) {
        mBlue = (pY - aY) / (pX - aX);
      } else {
        mBlue = Math.pow(10, 10);
      }
       return mBlue >= mRed;
    }
  },
  
  pointWithinPolygon: function(pt, edges) {
    var self = this;
    var intersections = _(edges).select(function(edge) {
      return self.rayIntersectsEdge(pt, edge);
    });
    return intersections.length % 2 !== 0;
  }
    
  
};

// Epic hack
if (typeof window === 'undefined') {
  module.exports = geometry;
}
