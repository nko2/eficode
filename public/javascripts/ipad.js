var isPad = navigator.userAgent.match(/iPad/i) != null;

//if (isPad) {
  
  var start = function(game, socket) {
    
    $('<meta name="viewport" content="width=device-width,maximum-scale=1.0" />').appendTo($('head'));
    $('.container_10').css({
      width: '1024px',
      minWidth: '1024px'
    });
    $('#header, #instructions').hide();
    $('.grid_2').css({
      width: '150px'
    });
    $('#game').css({
      width: '750px',
      paddingRight: '0'
    });
    
    var moveControls = $('<canvas>');
     $(moveControls.css({
       position: 'fixed',
       left: '20px',
       bottom: '20px',
       width: '200px',
       height: '200px',
       backgroundColor: 'black'
     }));
     var moveCanvas = moveControls[0];
     var ctx = moveCanvas.getContext('2d');
     $(document.body).append(moveControls);
     
     var upTriangle = [[[0,   0],   [200, 0]],   [[200, 0],   [100, 100]], [[100, 100], [0, 0]]];
     var downTriangle =   [[[0,   200], [200, 200]], [[200, 200], [100, 100]], [[100, 100], [0, 200]]];
     var leftTriangle =   [[[0,   0],   [100, 100]], [[100, 100], [0,   200]], [[0,   200], [0, 0]]];
     var rightTriangle =  [[[200, 0],   [200, 200]], [[200, 200], [100, 100]], [[100, 100], [200, 0]]];
     
     var getControlX = function(x) {
       return x - $(moveControls).offset().left;
     };
     var getControlY = function(y) {
       return y - $(moveControls).offset().top;
     };
     
     var getDirection = function(x, y) {
       var controlX = getControlX(x)
         , controlY = getControlY(y)
         , controlPoint = [controlX, controlY];
       if (geometry.pointWithinPolygon(controlPoint, upTriangle)) {
         return params.Direction.UP;
       } else if (geometry.pointWithinPolygon(controlPoint, downTriangle)) {
         return params.Direction.DOWN;
       } else if (geometry.pointWithinPolygon(controlPoint, leftTriangle)) {
         return params.Direction.LEFT;
       } else if (geometry.pointWithinPolygon(controlPoint, rightTriangle)) {
          return params.Direction.RIGHT;
       }
     };
     
     moveCanvas.addEventListener('touchstart', function(evt) {
       var touch = evt.targetTouches[0]
          , x = touch.clientX
          , y = touch.clientY
          , dir = getDirection(x, y);
       if (dir) {
         game.changeDirection(dir);
       }
       evt.preventDefault();
       return false;
     });
     moveCanvas.addEventListener('touchmove', function(evt) {
       var touch = evt.targetTouches[0]
          , x = touch.clientX
          , y = touch.clientY
          , dir = getDirection(x, y);
       if (dir) {
        game.changeDirection(dir);
       }
       evt.preventDefault();
       return false;
     });
     moveCanvas.addEventListener('touchend', function(evt) {
       game.stopMoving();
       return false;
     });
     
     
     
     var fireControls = $('<canvas>');
      $(fireControls.css({
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '200px',
        height: '200px',
        backgroundColor: 'black'
      }));
      var fireCanvas = fireControls[0];
      var ctx = fireCanvas.getContext('2d');
      $(document.body).append(fireControls);
          
      fireCanvas.addEventListener('touchstart', function(evt) {
        game.fire();
        evt.preventDefault();
        return false;
      });
  };
 

  
//}

exports.start = start;