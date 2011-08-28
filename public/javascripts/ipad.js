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
       height: '200px'
     }));
     var moveCanvas = moveControls[0];
     moveCanvas.width = 200;
     moveCanvas.height= 200;
     var ctx = moveCanvas.getContext('2d');
     
     ctx.strokeStyle = '#000';
     ctx.fillStyle = 'rgba(200, 200, 200, 100)';
     
     ctx.beginPath();
     ctx.moveTo(0, 0);
     ctx.lineTo(200, 0);
     ctx.lineTo(100, 100);
     ctx.closePath();
     ctx.fill();
     
     ctx.beginPath();
     ctx.moveTo(0, 200);
     ctx.lineTo(200, 200);
     ctx.lineTo(100, 100);
     ctx.closePath();
     ctx.fill();
     
     ctx.beginPath();
     ctx.moveTo(0, 0);
     ctx.lineTo(100, 100);
     ctx.lineTo(0, 200);
     ctx.closePath();
     ctx.fill();
     
     ctx.beginPath();
     ctx.moveTo(200, 0);
     ctx.lineTo(200, 200);
     ctx.lineTo(100, 100);
     ctx.closePath();
     ctx.fill();
     
     ctx.fillStyle = 'black';
     ctx.beginPath();
     ctx.moveTo(80, 40);
     ctx.lineTo(120, 40);
     ctx.lineTo(100, 20);
     ctx.closePath();
     ctx.fill();
     
     ctx.fillStyle = 'black';
     ctx.beginPath();
     ctx.moveTo(80, 160);
     ctx.lineTo(120, 160);
     ctx.lineTo(100, 180);
     ctx.closePath();
     ctx.fill();
     
     ctx.fillStyle = 'black';
     ctx.beginPath();
     ctx.moveTo(40, 80);
     ctx.lineTo(40, 120);
     ctx.lineTo(20, 100);
     ctx.closePath();
     ctx.fill();
     
     ctx.fillStyle = 'black';
     ctx.beginPath();
     ctx.moveTo(160, 80);
     ctx.lineTo(160, 120);
     ctx.lineTo(180, 100);
     ctx.closePath();
     ctx.fill();
     
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
        height: '200px'
      }));
      var fireCanvas = fireControls[0];
      var ctx = fireCanvas.getContext('2d');
      fireCanvas.width = 200;
      fireCanvas.height= 200;
      var fCtx = fireCanvas.getContext('2d');

      fCtx.strokeStyle = '#000';
      fCtx.fillStyle = 'rgba(200, 200, 200, 100)';
      
      fCtx.fillRect(0, 0, 200, 200);
      
      fCtx.font = "bold 30px sans-serif";
      fCtx.fillStyle = 'black';
      fCtx.fillText("Fire", 75, 110);
      
      $(document.body).append(fireControls);
          
      fireCanvas.addEventListener('touchstart', function(evt) {
        game.fire();
        evt.preventDefault();
        return false;
      });
  };
 

  
//}

exports.start = start;