window.FRONTLINE = {
    BOOKMARK  : "addBookmark"
  , SCAN      : "scanTo"
  , PLAY      : "play"
  , PAUSE     : "pause"
  , DURATION  : "videoDuration"
  , CONNECTED : "partnerConnected"
  , CONNECT   : "newClient"
  , TIMECODE  : "timeCode"
  , JOIN      : "joinSession"
  , FREQUENCY : 500 // How often we send progress to mobile devices, in ms.
  , TIMECODES : {
      30:  {text:"Timeline: Inside the Meltdown", links: ['http://www.pbs.org/wgbh/pages/frontline/meltdown/cron/']},
      70:  {text:"The Appetite for Subprime Mortgages", links: ['http://www.pbs.org/wgbh/pages/frontline/oral-history/financial-crisis/tags/subprime-mortgages/']},
      144: {text:"More from Wall Street's Super-Lawyer", links: ['http://www.pbs.org/wgbh/pages/frontline/oral-history/financial-crisis/rodgin-cohen/']},
      191: {text:"Who Is Timothy Geithner?", links: ['http://www.pbs.org/wgbh/pages/frontline/oral-history/financial-crisis/tags/tim-geithner/']},
      257: {text:"What Are Credit Default Swaps?", links: ['http://www.pbs.org/wgbh/pages/frontline/oral-history/financial-crisis/tags/credit-default-swaps/']},
      310: {text:"\"Too Big to Fail\"", links: ['http://www.pbs.org/wgbh/pages/frontline/oral-history/financial-crisis/tags/too-big-to-fail/']},
      358: {text:"Read the Report", links: ['http://fcic.law.stanford.edu/']},
      392: {text:"The Tide of Deregulation", links: ['http://www.pbs.org/wgbh/pages/frontline/warning/cron/']},
      411: {text:"How She Tried to Push for Regulation", links: ['http://www.pbs.org/wgbh/pages/frontline/warning/']},
      470: {text:"\"The Bernanke Conundrum\"", links: ['http://www.nytimes.com/2012/04/29/magazine/chairman-bernanke-should-listen-to-professor-bernanke.html?_r=1&hp&pagewanted=print']},
      587: {text:"Inside the Decision to Rescue Bear Stearns", links: ['http://www.pbs.org/wgbh/pages/frontline/meltdown/themes/bear.html']},
      742: {text:"The Greenspan Era", links: ['http://www.pbs.org/wgbh/pages/frontline/warning/themes/greenspan.html']}
  }
  , TIME_TO_CODE : function (secs) {
      var hours = Math.floor(secs / (60 * 60));

      var divisor_for_minutes = secs % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);

      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);

      return "" + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds;
  }
  , GET_TEXT_FOR_TIME : function (time) {
      return FRONTLINE.GET_OBJECT_FOR_TIME(time).text;
  }
  , GET_OBJECT_FOR_TIME : function (time) {
      var obj = FRONTLINE.TIMECODES[0];
      var timer = 0;
      for (key in FRONTLINE.TIMECODES) {
        if (time >= key) {
          timer = key;
          obj = FRONTLINE.TIMECODES[key];
        }
      }
      obj = (obj || {});
      obj['time'] = timer;
      return obj;
  }
  , GET_TIME_FOR_TIME : function (time) {
      return FRONTLINE.GET_OBJECT_FOR_TIME(time).time;
  }
  , GET_LINK_FOR_TIME : function (time) {
      return FRONTLINE.GET_OBJECT_FOR_TIME(time).links[0];
  }
  , MAKE_LINKS_FOR_TIME : function (time) {
      var str = "", obj = FRONTLINE.GET_OBJECT_FOR_TIME(time);
      str = str + " <a href='javascript:scanTo(" + obj['time'] +
        ")'>Go back to " + FRONTLINE.TIME_TO_CODE(obj['time']) + "</a>";
      return str;
  }
}
