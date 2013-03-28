'use strict';

module.exports = function(app, isLoggedIn) {
  var appnet = require('../lib/appnet');
  var utils = require('../lib/utils');

  app.get('/', function(req, res) {
    if (req.session && req.session.passport.user) {
      req.session.url = '/feed';

      res.render('index', {
        session: utils.getUser(req)
      });
    } else {
      res.render('index', {
        session: false
      });
    }
  });

  app.get('/feed', isLoggedIn, function(req, res) {
    req.session.url = '/my/feed';

    appnet.myFeed(req, function(err, recentMessages) {
      if (err) {
        res.status(500);
        res.json({ 'error': 'error retrieving your personal feed' });

      } else {
        utils.generateFeed(req, recentMessages, function(messages) {
          res.render('_feed', {
            layout: false,
            messages: messages
          });
        });
      }
    });
  });

  app.get('/:username/feed', isLoggedIn, function(req, res) {
    var userId = req.params.id || utils.getUserId(req);

    req.session.url = '/' + req.params.username + '/feed';

    appnet.userPosts(req, function(err, recentMessages) {
      if (err) {
        res.status(500);
        res.json({ 'error': 'error retrieving your posts' });

      } else {
        utils.generateFeed(req, recentMessages, function(messages) {
          res.render('_feed', {
            layout: false,
            messages: messages
          });
        });
      }
    });
  });
};
