var
  express = require('express'),
  path = require('path'),
  app = express(),
  async = require('async'),
  fs = require('fs'),
  persistence = require('./lib/persistence.js'),
  adminName = process.env.ADMIN_NAME || 'admin',
  adminPass = process.env.ADMIN_PASS || '12345';


  app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname)));
});


var basicAuth = express.basicAuth(function (username, password) {
  return (username == adminName && password == adminPass);
}, 'Restrict area, please identify');


app.get('/questions.json', function (req, res, next) {
  persistence.getQuestions(function (err, result) {
    if (err) {
      next(err);
    }
    res.send(JSON.stringify(result));
  })
});

app.get('/questions/', basicAuth, function (req, res, next) {
  persistence.getQuestions(function (err, result) {
    if (err) {
      next(err);
    }
    res.render('index', {questions: result});
  })
});

app.get('/questions', basicAuth, function (req, res) {
  res.redirect('/questions/');
});

app.get('/questions/:id/edit', basicAuth, function (req, res, next) {
  persistence.getQuestion(req.params.id, function (err, result) {
    if (err) {
      next(err);
    }
    res.render('edit', {question: result});
  })
});

app.post('/questions/:id/submit', basicAuth, function (req, res, next) {
  var question = req.body;
  persistence.saveQuestion(question, function (err, result) {
    if (err) {
      return next(err);
    }
    if (result === 1) {
      res.render('updated', {question: question});
    } else {
      res.redirect('/questions/' + question.id + '/edit');
    }
  });

});

var http = require('http');
var server = http.createServer(app);


server.listen(process.env.PORT || 5000, function () {
  console.log('Server running');
});
