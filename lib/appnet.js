'use strict';

var qs = require('querystring');
var request = require('request');
var utils = require('./utils');

var APPNET_URL = 'https://alpha-api.app.net/stream/0';
var TIMEOUT = 20000;
var MAX_COUNT = 30;

var requestGet = function(url, params, callback) {
  request.get({ uri: APPNET_URL + url + '?' + qs.stringify(params), timeout: TIMEOUT },
    function(err, resp, body) {
    if (err) {
      callback(err);
    } else {
      try {
        callback(null, JSON.parse(body));
      } catch(err) {
        callback(err);
      }
    }
  });
};

exports.myFeed = function(req, callback) {
  var user = utils.getUser(req);
  var url = '/posts/stream';
  var directedFeed = 0;

  var params = {
    access_token: user.access_token,
    include_deleted: 0,
    include_directed_posts: directedFeed,
    include_annotations: 1,
    count: MAX_COUNT
  };

  requestGet(url, params, callback);
};

exports.userPosts = function(req, callback) {
  var user = utils.getUser(req);
  var userId = req.params.username;
  var url = '/users/' + userId + '/posts';

  var params = {
    access_token: user.access_token,
    include_deleted: 0,
    include_annotations: 1,
    count: MAX_COUNT
  };

  requestGet(url, params, callback);
};
