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
  res.render('mobile.jade', {title:"mobile!", sessionId:req.params['session_id'] || '0' });
});


var sessions = [];

io.sockets.on('connection' , function (socket) {

  socket.on('newClient', function(callback) {
    var id = sessions.length;
    sessions.push({id:id, browserSocket:socket, bookmarks:[]});
    callback(id);
  });

  socket.on('joinSession', function(id, callback) {
    var session = sessions[id];
    session.mobileSocket = socket;
    session.browserSocket.emit('partnerConnected', {});
    callback();
  });


});

app.listen(9004);
