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
     
     moveControlsObj.addEventListener('touchstart', function(evt) {
       socket.send('touches '+evt.targetTouches+' '+evt.targetTouches[0]);
       var touch = evt.targetTouches[0]
          , x = touch.clientX
          , y = touch.clientY;
           
       socket.send('touch start '+x+','+y);
       socket.send(evt);
       return false;
     });
     moveControlsObj.addEventListener('touchmove', function(evt) {
       socket.send('m touches '+evt.targetTouches+' '+evt.targetTouches[0]);
       
       var touch = evt.targetTouches[0]
          , x = touch.clientX
          , y = touch.clientY;
       
       socket.send('touch mov '+x+','+y);
       return false;
     });
     moveControlsObj.addEventListener('touchend', function(evt) {
       socket.send('touch end');
       return false;
     });
     
     $(document.body).append(moveControls);
  };
 

  
//}

exports.start = start;