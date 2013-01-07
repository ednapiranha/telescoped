'use strict';

module.exports = function(app, isLoggedIn, config) {
  var appnet = require('../lib/appnet');
  var utils = require('../lib/utils');

  var charLimit = 256;

  app.get('/', function(req, res) {
    var analytics = false;

    if (req.session.passport.user) {
      req.session.url = '/feed';

      if (config.get('analytics')) {
        analytics = config.get('analytics');
      }

      res.render('index', {
        session: utils.getUser(req),
        analytics: analytics
      });

    } else {
      res.render('index', {
        session: false,
        analytics: analytics
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
