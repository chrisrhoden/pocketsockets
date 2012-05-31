var express = require('express')
  , sockets = require('socket.io')
  , Base64  = require('./lib/base64');

var app = express.createServer();
var io  = sockets.listen(app);
var md5 = require('MD5');

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

app.configure(function() {
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
})

var sessions = {};

io.sockets.on('connection' , function (socket) {

  var session;

  socket.on('newClient', function(callback) {
    var sessionId = makeSessionId(sessions);

    session = sessions[sessionId] = {id:sessionId, browserSocket:socket, bookmarks:[]};

    callback(sessionId);

    var mobileReceives = ['timeCode', 'videoDuration'];

    mobileReceives.forEach(function(el) {
      socket.on(el, function() {
        arguments.unshift(el);
        session.mobileSocket.emit.apply(session.mobileSocket, arguments);
      });
    });

  });

  socket.on('joinSession', function(id, callback) {
    session = sessions[id];
    session.mobileSocket = socket;
    session.browserSocket.emit('partnerConnected', {});
    callback();

    var browserReceives = ['addBookmark', 'switchVideo', 'scanTo', 'play',
      'pause', 'skipBack', 'skipForward'];

    browserReceives.forEach(function(el) {
      socket.on(el, function() {
        arguments.unshift(el);
        session.browserSocket.emit.apply(session.browserSocket, arguments);
      });
    });
  });



});

function makeSessionId(sessions, length) {
  length = (length || 5);

  var sessionId = parseInt(md5('a salt' + sessions.length + new Date()).replace(/[^0-9]/g,''));
  sessionId = Base64.encode(500 + sessionId);
  sessionId = sessionId.substring(0,length);
  if (sessions[sessionId]) {
    return makeSessionId(sessions, length + 1);
  } else {
    return sessionId;
  }
}

var port = process.env['PORT'] || 9004;
console.log("listening on port " + port);
app.listen(port);
