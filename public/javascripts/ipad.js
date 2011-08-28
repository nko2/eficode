var isPad = navigator.userAgent.match(/iPad/i) != null;

if (isPad) {
  
  var moveControls = $('<div>');
  $(moveControls.css({
    position: 'fixed',
    left: '20px',
    bottom: '20px',
    width: '200px',
    height: '200px',
    backgroundColor: 'black'
  }));
  $(document.body).append(moveControls);
  
}

