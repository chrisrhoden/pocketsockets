var express = require('express');

var app = express.createServer();

app.configure(function() {
  app.use(express.logger());
})

app.get('/', function(req, res) {
  res.end("SUCCESS!");
});

app.get('/mobile', function(req, res) {

});

app.listen(8000);
