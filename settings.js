'use strict';

// Module dependencies.
module.exports = function(app, configurations, express) {
  var RedisStore = require('connect-redis')(express);
  var nconf = require('nconf');
  var passport = require('passport');
  var requirejs = require('requirejs');
  var utils = require('./lib/utils');

  var ONE_DAY = 86400000;

  nconf.argv().env().file({ file: 'local.json' });

  // Configuration

  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    if (!process.env.NODE_ENV) {
      app.use(express.logger('dev'));
      app.use(express.static(__dirname + '/public'));
    } else {
      app.use(express.static(__dirname + '/public_build', { maxAge: ONE_DAY }));
    }
    app.use(express.cookieParser());
    app.use(express.session({
      secret: nconf.get('session_secret')
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.locals.pretty = true;
    app.use(app.router);
    app.use(function(req, res, next) {
      res.status(404);
      res.render('404', { url: req.url, layout: false });
      return;
    });
    app.use(function(req, res, next) {
      res.status(403);
      res.render('403', { url: req.url, layout: false });
      return;
    });
    app.use(function(err, req, res, next) {
      var status = err.status || 500;
      console.error('Uncaught error.  Returning ' + status + ': ', err);
      res.status(status);
      res.render('500', { error: err, layout: false });
    });
  });

  app.configure('development, test', function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('prod', function(){
    app.use(express.errorHandler());

    requirejs.optimize({
      appDir: 'public/',
      baseUrl: 'javascripts/',
      enforceDefine: true,
      dir: "public_build",
      modules: [
        {
          name: 'main'
        }
      ]
    }, function() {
      console.log('Successfully optimized javascript');
    });
  });

  return app;
};
