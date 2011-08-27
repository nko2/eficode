var nko = require('nko')('omnfFLVFKjn9/jVm')
  , express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , game = require('./game');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
app.configure('production', function(){
  app.use(express.errorHandler()); 
});


app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

io.sockets.on('connection', function(socket) {
  socket.on('setnick', function(nick, cb) {
    socket.set('nick', nick, function() {
      game.playerJoined(nick);
      cb();
    })
  });
  socket.on('disconnect', function() {
    socket.get('nick', function(err, nick) {
      game.playerLeft(nick);
    });
  });
});

game.on('state', function(state) {
  io.sockets.emit('gameState', state);
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
