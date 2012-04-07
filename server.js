var express = require('express')
  , sockets = require('socket.io');

var app = express.createServer();
var io  = sockets.listen(app);

app.configure(function() {
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
})

app.get('/', function(req, res) {
  res.render('index.jade', {title:"Hi"});
});

app.get('/mobile', function(req, res) {
  res.end("SUCCESS!");
});

io.sockets.on('connection' , function (socket) {

});

app.listen(9004);
