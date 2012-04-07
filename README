# PocketSockets

How it works:

```html
<html>
  <head>
    <title>Socket Demo</title>
    <script src="//sockets.chrisrhoden.com/desktop.js"></script>
    <script>
      (function () {
        var ps = com.chrisrhoden.sockets;

        ps.connect(function (socket) {
          $('#qr').attr('src', socket.qr);
          socket.on('join', function (data) {
            $('#qr-container').hide();
          });

          socket.on('data', function (data) {
            console.log(data);
          });
        });

      })();
    </script>
  </head>
  <body>
    <div id="qr-container">
      Scan this: <img id="qr" />
    </div>
  </body>
</html>
```

```html
<html>
  <head>
  <title>Socket Demo (mobile page)</title>
  <script src="//sockets.chrisrhoden.com/mobile.js"></script>
  <script>
    (function () {
      var ps = com.chrisrhoden.sockets;

      ps.connect(function (socket) {
        $(form).submit(function () {
          var val = $('#text').val();
          $('#text').val('');

          socket.emit('data', {text:text});
        });
      });

    })();
  </script>
  </head>
  <body>
    <form>
    <input type='text' id='text' /><input type='submit' />
    </form>
  </body>
</html>
```
