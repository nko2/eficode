var nko = require('nko')('omnfFLVFKjn9/jVm')
  , fs = require('fs')
  , express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , gameIo = require('./game_io')
  , movementFile = fs.readFileSync('./movement.js');

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
  res.render('index');
});
app.get('/movement.js', function(req, res) {
  res.writeHead(200, {"Content-Type": "text/javascript"});
  res.end(movementFile);
})

app.listen(3000);
gameIo(io);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
