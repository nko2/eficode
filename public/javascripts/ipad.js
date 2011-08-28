var isPad = navigator.userAgent.match(/iPad/i) != null;

//if (isPad) {
  
  var start = function(socket) {
    
    $('<meta name="viewport" content="width=device-width,maximum-scale=1.0" />').appendTo($('head'));
    
    var moveControls = $('<div>');
     $(moveControls.css({
       position: 'fixed',
       left: '20px',
       bottom: '20px',
       width: '200px',
       height: '200px',
       backgroundColor: 'black'
     }));
     
     moveControls.bind('touchstart', function(evt) {
       socket.send('touch start');
       socket.send(evt);
       evt.preventDefault();
       return false;
     });
     
     $(document.body).append(moveControls);
  };
 

  
//}

exports.start = start;