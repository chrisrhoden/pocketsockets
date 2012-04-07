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
  res.render('mobile.ejs', {title:"mobile!", sessionId:req.query.session_id || '0' });
});


var sessions = [];

io.sockets.on('connection' , function (socket) {

  var session;

  socket.on('newClient', function(callback) {
    var sessionId = sessions.length;
    session = sessions[sessionId] = {id:sessionId, browserSocket:socket, bookmarks:[]};

    callback(sessionId);

    socket.on('timeCode', function(time) {
      session.mobileSocket.emit('timeCode', time);
    });

    socket.on('videoDuration', function(time) {
      session.mobileSocket.emit('videoDuration', time);
    });

  });

  socket.on('joinSession', function(id, callback) {
    session = sessions[id];
    session.mobileSocket = socket;
    session.browserSocket.emit('partnerConnected', {});
    callback();

    socket.on('addBookmark', function (time) {
      session.browserSocket.emit('addBookmark', time);
    });

    socket.on('switchVideo', function() {
      session.browserSocket.emit('switchVideo');
    });

    socket.on('scanTo', function(time) {
      session.browserSocket.emit('scanTo', time);
    })
  });



});

app.listen(9004);
