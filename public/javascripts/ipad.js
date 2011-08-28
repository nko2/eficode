var isPad = navigator.userAgent.match(/iPad/i) != null;

  
var start = function(game, socket) {
  if (isPad) {
    
    $(document.body).css({
      width: '960px',
      height: '680px',
      minWidth: '960px'
    });
    $('#header').css({
      paddingTop: '0',
      paddingBottom: '0'
    })
    $('#instructions').hide();
    $('.grid_2').css({
      width: '150px'
    });
    $('#game').css({
      width: '750px',
      paddingRight: '0'
    });
  
    addMoveControls(game);
    addFireControls(game);
  }
};

var addMoveControls = function(game) {
  
  var moveControls = $('<canvas>');
   $(moveControls.css({
     position: 'fixed',
     left: '20px',
     bottom: '20px',
     width: '200px',
     height: '200px',
    WebkitBorderRadius: '30px'
   }));
   var moveCanvas = moveControls[0];
   moveCanvas.width = 200;
   moveCanvas.height= 200;
   
   var ctx = moveCanvas.getContext('2d');
   
   drawMoveControls(ctx, moveCanvas);
   
   $(document.body).append(moveControls);
   
   var upTriangle =     [[[0,   0],   [200, 0]],   [[200, 0],   [100, 100]], [[100, 100], [0, 0]]];
   var downTriangle =   [[[0,   200], [200, 200]], [[200, 200], [100, 100]], [[100, 100], [0, 200]]];
   var leftTriangle =   [[[0,   0],   [100, 100]], [[100, 100], [0,   200]], [[0,   200], [0, 0]]];
   var rightTriangle =  [[[200, 0],   [200, 200]], [[200, 200], [100, 100]], [[100, 100], [200, 0]]];
   
   var getDirection = function(x, y) {
     var controlX = x - $(moveControls).offset().left
       , controlY = y - $(moveControls).offset().top
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
        , dir = getDirection(touch.clientX, touch.clientY);
     if (dir &&  dir !== game.currentDirection) {
       game.changeDirection(dir);
     }
     drawMoveControls(ctx, moveCanvas, dir);
     evt.preventDefault();
     return false;
   });
   moveCanvas.addEventListener('touchmove', function(evt) {
     var touch = evt.targetTouches[0]
        , dir = getDirection(touch.clientX, touch.clientY);
     if (dir &&  dir !== game.currentDirection) {
      game.changeDirection(dir);
     }
     drawMoveControls(ctx, moveCanvas, dir);
     evt.preventDefault();
     return false;
   });
   moveCanvas.addEventListener('touchend', function(evt) {
     game.stopMoving();
     drawMoveControls(ctx, moveCanvas);
     return false;
   });
}

var drawMoveControls = function(ctx, canvas, dir) {
  clearCanvas(ctx, canvas);
  
  ctx.strokeStyle = '#000';

  var upAlpha = 0.4;
  if (dir === params.Direction.UP) upAlpha = 0.7;
  ctx.fillStyle = makeLinearGradient(ctx, 100, 100, 100, 0, upAlpha);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(200, 0);
  ctx.lineTo(100, 100);
  ctx.closePath();
  ctx.fill();
  
  var downAlpha = 0.4;
  if (dir === params.Direction.DOWN) downAlpha = 0.7;
  ctx.fillStyle = makeLinearGradient(ctx, 100, 100, 100, 200, downAlpha);
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(200, 200);
  ctx.lineTo(100, 100);
  ctx.closePath();
  ctx.fill();
  
  var leftAlpha = 0.4;
  if (dir === params.Direction.LEFT) leftAlpha = 0.7;
  ctx.fillStyle = makeLinearGradient(ctx, 100, 100, 0, 100, leftAlpha);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 100);
  ctx.lineTo(0, 200);
  ctx.closePath();
  ctx.fill();

  var rightAlpha = 0.4;
  if (dir === params.Direction.RIGHT) rightAlpha = 0.7;
  ctx.fillStyle = makeLinearGradient(ctx, 100, 100, 200, 100, rightAlpha);
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
  
  ctx.beginPath();
  ctx.moveTo(80, 160);
  ctx.lineTo(120, 160);
  ctx.lineTo(100, 180);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(40, 80);
  ctx.lineTo(40, 120);
  ctx.lineTo(20, 100);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(160, 80);
  ctx.lineTo(160, 120);
  ctx.lineTo(180, 100);
  ctx.closePath();
  ctx.fill();
}

var makeLinearGradient = function(ctx, x1, y1, x2, y2, alpha) {
  var grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, 'rgba(50, 50, 50, '+alpha+')');
  grad.addColorStop(1, 'rgba(20, 20, 20, '+alpha+')');
  return grad;
}

var addFireControls = function(game) {
  
  var fireControls = $('<canvas>');
   $(fireControls.css({
     position: 'fixed',
     right: '20px',
     bottom: '20px',
     width: '200px',
     height: '200px',
     WebkitBorderRadius: '30px'
   }));
   var fireCanvas = fireControls[0];
   var ctx = fireCanvas.getContext('2d');
   fireCanvas.width = 200;
   fireCanvas.height= 200;
   var fCtx = fireCanvas.getContext('2d');

   drawFireControls(fCtx, fireCanvas, 0.4);
   
   $(document.body).append(fireControls);
       
   fireCanvas.addEventListener('touchstart', function(evt) {
     game.fire();
     drawFireControls(fCtx, fireCanvas, 0.7);
     setTimeout(function() {
       drawFireControls(fCtx, fireCanvas, 0.4);
     }, 100);
     evt.preventDefault();
     return false;
   });
}

var drawFireControls = function(fCtx, canvas, alpha) {
  clearCanvas(fCtx, canvas);
  
  fCtx.strokeStyle = '#000';
  fCtx.fillStyle = '#ccc';
  var fireGrad = fCtx.createRadialGradient(100, 100, 50, 100, 100, 150);      
  fireGrad.addColorStop(0, 'rgba(50, 50, 50, '+alpha+')');
  fireGrad.addColorStop(1, 'rgba(20, 20, 20, '+alpha+')');
  fCtx.fillStyle = fireGrad;
  
  fCtx.fillRect(0, 0, 200, 200);
  
  fCtx.font = "bold 30px sans-serif";
  fCtx.fillStyle = 'black';
  fCtx.fillText("Fire", 75, 110);
}

var clearCanvas = function(ctx, canvas) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}


exports.start = start;