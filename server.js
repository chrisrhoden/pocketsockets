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
  res.render('index.ejs', {title:"Hi"});
});

app.get('/mobile', function(req, res) {
  res.render('mobile.ejs', {title:"mobile!", sessionId:req.params['session_id'] || '0' });
});


var sessions = [];

io.sockets.on('connection' , function (socket) {

  var session;

  socket.on('newClient', function(callback) {
    var sessionId = sessions.length;
    sessions.push({id:sessionId, browserSocket:socket, bookmarks:[]});
    session = sessions[sessionId];
    callback(sessionId);
  });

  socket.on('joinSession', function(id, callback) {
    session = sessions[id];
    session.mobileSocket = socket;
    session.browserSocket.emit('partnerConnected', {});
    callback();
  });

  socket.on('buttonPressed', function () {
    session.browserSocket.emit('buttonPressed');
  });


});

app.listen(9004);
