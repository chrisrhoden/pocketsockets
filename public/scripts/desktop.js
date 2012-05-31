(function () {
  var x = FRONTLINE;
  var socket = io.connect();
  var videoEl = $('#videoel')[0];
  var bookmarks = $('#bookmarks');
  var notifications = $('#notifications');
  var currentTime = 0.0;
  var id;

  // WIRE UP SOCKET EVENTS.

  socket.on(x.CONNECTED, function() {

    // HIDE QR CODE AND PLAY
    $('#qr-container').animate({'top': -400}, function() {
      $(this).hide();
      $('#shade').fadeIn();
      $('#video-container').fadeIn(function () {
        videoEl.play();
      });
    });

    // SEND THE CURRENT POSITION OF THE SCRUBBER EVERY #FREQUENCY
    setInterval(function () {
      if (currentTime != videoEl.currentTime) {
        socket.emit(x.TIMECODE, currentTime = videoEl.currentTime)
      }
    }, x.FREQUENCY);

    // SEND THE DURATION OF THE CLIP WE HAVE LOADED.
    socket.emit(x.DURATION, videoEl.duration);
  });

  // WHEN A BOOKMARK IS ADDED
  socket.on(x.BOOKMARK, function(time) {
    bookmarks.append("<li>" + x.TIME_TO_CODE(time) + '</li>');
    var notification = $(document.createElement('li')).append(
      "Added bookmark: " + x.TIME_TO_CODE(time) + "<br />\"" +
      x.GET_TEXT_FOR_TIME(time) + "\"");
    notifications.append(notification);
    setTimeout(function() { notification.animate({'opacity':0}, function () {
      $(this).slideUp();
    })}, 2000);
  });

  // WHEN WE SCAN TO ANOTHER POINT IN THE CLIP
  socket.on(x.SCAN, function(time) {
    videoEl.currentTime = time;
  });

  // PLAY PRESSED
  socket.on(x.PLAY, function() {
    videoEl.play();
  });

  // PAUSE PRESSED
  socket.on(x.PAUSE, function() {
    videoEl.pause();
  });

  // END WIRING UP EVENTS

  // CONNECT!
  socket.emit(x.CONNECT, function (myId) {
    id = myId;
    // WHEN WE GET OUR ID BACK, ADD THE QR CODE.
    $('#qr').attr("src", "http://chart.googleapis.com/chart?cht=qr&chs=150x150&choe=UTF-8&chld=H&chl=" + "http://" + window.location.host + "/mobile.html%23" + id);
  });

})();
