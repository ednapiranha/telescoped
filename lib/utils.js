'use strict';

var request = require('request');
var tokenize = require('./tokenize');

exports.getUser = function(req) {
  return req.session.passport.user;
};

exports.getUserId = function(req) {
  return req.session.passport.user.id;
};

/* Generate the feed content
 * Requires: web request, recentMessages, callback
 * Returns: the messages as JSON
 */
exports.generateFeed = function(req, recentMessages, callback) {
  var self = this;

  var newMessages = [];
  var userSession = self.getUser(req);
  var userId = userSession.id;
  var username = userSession.username;

  if (recentMessages.data) {
    recentMessages = recentMessages.data;
  }

  if (recentMessages.length > 0) {
    var annotations = '';

    for (var i = 0; i < recentMessages.length; i ++) {
      var recent = recentMessages[i];
      if (recent.data) {
        recent = recent.data;
      }

      newMessages.push({
        author: {
          name: recent.user.name,
          username: '@' + recent.user.username,
          avatar: recent.user.avatar_image.url
        },
        created: recent.created_at,
        html: tokenize.generate(recent.text),
        url: recent.canonical_url
      });
    }

    callback(newMessages);
  } else {
    callback(newMessages);
  }
};
