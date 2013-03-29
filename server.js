var
  express = require('express'),
  path = require('path'),
  app = express(),
  async = require('async'),
  fs = require('fs'),
  mongo = require('mongodb'),
  mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/test?safe=true',
  adminName = process.env.ADMIN_NAME || 'admin',
  adminPass = process.env.ADMIN_PASS || '12345',
  Db = mongo.Db.connect(mongoUri, {noOpen: true}, function (err, db) {
  });


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

function getQuestions(callback) {
  Db.open(function (err, db) {
    var test = db.collection('test');
    test.find().toArray(function (error, result) {
      db.close();
      if (error) {
        return callback(error);
      }
      result.sort(function (a, b) {
        return a.id.localeCompare(b.id);
      })
      callback(null, result);
    });
  });
}

function getQuestion(id, callback) {
  Db.open(function (err, db) {
    var test = db.collection('test');
    test.find({id: id}).toArray(function (error, result) {
      db.close();
      if (error) {
        return callback(error);
      }
      callback(null, result[0]);
    });
  });
}

function saveQuestion(question, callback) {
  Db.open(function (err, db) {
    var test = db.collection('test');
    test.update({id: question.id}, {$set: {question: question.question}}, {w: 1}, function (error, result) {
      db.close();
      if (error) {
        return callback(error);
      }
      callback(null, result);
    });
  });
}

app.get('/questions.json', function (req, res, next) {
  getQuestions(function (err, result) {
    if (err) {
      next(err);
    }
    res.send(JSON.stringify(result));
  })
});

app.get('/questions/', basicAuth, function (req, res, next) {
  getQuestions(function (err, result) {
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
  getQuestion(req.params.id, function (err, result) {
    if (err) {
      next(err);
    }
    res.render('edit', {question: result});
  })
});

app.post('/questions/:id/submit', basicAuth, function (req, res, next) {
  var question = req.body;
  saveQuestion(question, function (err, result) {
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
