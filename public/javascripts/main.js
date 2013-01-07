'use strict';

requirejs.config({
  baseUrl: '/javascripts/',
  enforceDefine: true,
  paths: {
    jquery: '/javascripts/jquery'
  }
});

define(['jquery'],
  function($) {

  var polling;
  var messages = $('ol.messages');
  var currentUrl = messages.data('url');

  var dateDisplay = function(time) {
    var date = new Date(time);
    var diff = (Date.now() - date) / 1000;
    var dayDiff = Math.floor(diff / 86400);

    if (isNaN(dayDiff)) {
      return '';
    }

    if (dayDiff <= 0) {
      if (diff < 60) {
        return 'less than 1 m';
      } else if (diff < 3600) {
        return Math.floor(diff / 60) + ' m';
      } else {
        return Math.floor(diff / 3600) + ' h';
      }
    } else {
      return dayDiff + ' d';
    }
  };

  var setFeed = function () {
    var feedLoad = function () {
      $.get(currentUrl, function (data) {
        messages.html(data);

        $('.time').each(function (idx) {
          var self = $(this);
          self.text(dateDisplay(self.text()));
        });
      });
    };

    feedLoad();

    polling = setInterval(function () {
      feedLoad();
    }, 20000);
  };

  setFeed();

  messages.on('click', '.avatar', function () {
    var self = $(this);

    currentUrl = self.data('url');
    clearInterval(polling);

    setFeed();
  });
});
