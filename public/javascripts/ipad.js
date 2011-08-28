var isPad = navigator.userAgent.match(/iPad/i) != null;

//if (isPad) {
  
  var start = function(socket) {
    
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
    
    var moveControls = $('<div>');
     $(moveControls.css({
       position: 'fixed',
       left: '20px',
       bottom: '20px',
       width: '200px',
       height: '200px',
       backgroundColor: 'black'
     }));
     var moveControlsEl = moveControls[0];
     
     var getControlX = function(x) {
       return x - $(moveControls).offset().left;
     };
     var getControlY = function(y) {
       return y - $(moveControls).offset().top;
     };
     
     moveControlsEl.addEventListener('touchstart', function(evt) {
       var touch = evt.targetTouches[0]
          , x = touch.clientX
          , y = touch.clientY;
       socket.send('start at '+getControlX(x)+","+getControlY(y));
       evt.preventDefault();
       return false;
     });
     moveControlsEl.addEventListener('touchmove', function(evt) {
       var touch = evt.targetTouches[0]
          , x = touch.clientX
          , y = touch.clientY;
       socket.send('move at '+getControlX(x)+","+getControlY(y));
       evt.preventDefault();
       return false;
     });
     moveControlsEl.addEventListener('touchend', function(evt) {
        socket.send('move end');
       return false;
     });
     
     $(document.body).append(moveControls);
  };
 

  
//}

exports.start = start;