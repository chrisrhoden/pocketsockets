(function () {
  var x = FRONTLINE;
  var socket = io.connect()
  var timeCodeEl = $('#time-code');
  var currentTime = 0;
  var duration = 0;
  var id;
  var paused = false;
  function getSessionId(hash) {
    return hash.replace('#', '');
  }

  socket.emit(x.JOIN, getSessionId(window.location.hash), function () {
    $('#button').click(function() {
      socket.emit(x.BOOKMARK, currentTime);
      $('#bookmarks').append("<tr><td>" + x.TIME_TO_CODE(currentTime) + "</td><td>" +
        x.GET_TEXT_FOR_TIME(currentTime) +"<br />"+
        x.MAKE_LINKS_FOR_TIME(currentTime) +
        "</td></tr>");
    });
  });

  $('#skipBack').click(function() {
    socket.emit(x.SCAN, 0);
  });

  $('#skipForward').click(function() {
    socket.emit(x.SCAN, duration);
  });

  $('#playPause').click(function() {
    var $this = $(this);
    if ($this.hasClass(x.PAUSE)) {
      $this.removeClass(x.PAUSE).addClass(x.PLAY);
      $('.progress').addClass(x.PAUSE);
      socket.emit(x.PAUSE);
    } else if ($this.hasClass(x.PLAY)) {
      $('.progress').removeClass(x.PAUSE);
      $this.removeClass(x.PLAY).addClass(x.PAUSE);
      socket.emit(x.PLAY);
    }
  });

  socket.on(x.TIMECODE, function (time) {
    currentTime = time;

    var percent = (time/duration) * 100;
    $('.bar').css('width', percent + "%");
    timeCodeEl.html(x.TIME_TO_CODE(time));
  });

  socket.on(x.DURATION, function(time) {
    duration = time;
    $('#duration').html(x.TIME_TO_CODE(time));
  });

  function scanTo(time) {
    socket.emit(x.SCAN, time);
  }
})();
