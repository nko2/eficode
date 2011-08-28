var nko = require('nko')('omnfFLVFKjn9/jVm')
  , fs = require('fs')
  , express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , gameIo = require('./game_io');

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

io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
io.set('browser client minification', true);
io.set('browser client etag', true);
io.set('log level', 3);

app.get('/', function(req, res){
  res.render('index');
});

var port = (process.env.NODE_ENV == 'production') ? 80 : 3000;
app.listen(port);
gameIo(io);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
