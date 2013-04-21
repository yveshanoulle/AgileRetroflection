var
  express = require('express'),
  path = require('path'),
  app = express(),
  async = require('async'),
  fs = require('fs'),
  passport = require('passport'),
  OpenIDStrategy = require('passport-openid').Strategy,
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
  persistence = require('./lib/persistence.js');

var port = 5000;

passport.use(new OpenIDStrategy({
    returnURL: 'http://localhost:5000/auth/openid/return',
    realm: 'http://localhost:5000/',
    profile: true
  },
  function (identifier, profile, done) {
    process.nextTick(function () {
      var user = { identifier: identifier, profile: profile};
      done(null, user);
    });
  }
));
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({secret: 'ReTrOfLeCtIoN'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname)));
});

app.get('/auth/openid', passport.authenticate('openid'));

app.get('/auth/openid/return', passport.authenticate('openid', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

app.get('/questions.json/:lastSave', function (req, res, next) {
  var lastSave = parseInt(req.params.lastSave, 10);
  persistence.getQuestionsSince(lastSave, function (err, result) {
    if (err) {
      next(err);
    }
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.send(JSON.stringify(result));
  })
});

app.get('/questions/', ensureLoggedIn('/login'), function (req, res, next) {
  persistence.getQuestions(function (err, result) {
    if (err) {
      next(err);
    }
    res.render('index', {questions: result});
  })
});

app.get('/questions', ensureLoggedIn('/login'), function (req, res) {
  res.redirect('/questions/');
});

app.get('/questions/:id/edit', ensureLoggedIn('/login'), function (req, res, next) {
  persistence.getQuestion(req.params.id, function (err, result) {
    if (err) {
      next(err);
    }
    res.render('edit', {question: result});
  })
});

app.post('/questions/:id/submit', ensureLoggedIn('/login'), function (req, res, next) {
  var question = req.body;
  persistence.saveQuestion(question, function (err, result) {
    if (err) {
      return next(err);
    }
    if (result === 1) {
      res.render('updated', {question: question});
    } else {
      res.redirect('/test_questions/' + question.id + '/edit');
    }
  });

});

app.get('/login', function (req, res) {
  res.render('login');
});

var http = require('http');
var server = http.createServer(app);

server.listen(process.env.PORT || port, function () {
  console.log('Server running');
});
