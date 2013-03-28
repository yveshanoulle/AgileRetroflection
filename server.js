var
  express = require('express'),
  path = require('path'),
  app = express(),
  async = require('async'),
  fs = require('fs'),
  mongo = require('mongodb'),
  mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/test?safe=true';
  adminName = process.env.ADMIN_NAME || 'admin';
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

var loadFile = function (file, cb) {
  fs.readFile(file, 'utf8', function (err, code) {
    if (err) {
      return cb("error loading file " + err);
    }
    try {
      cb(null, JSON.parse(code));
    }
    catch (e) {
      cb("Error parsing " + file + ": " + e);
    }
  });
};

function getQuestions(callback) {
  mongo.Db.connect(mongoUri, function (err, db) {
    if (err) {
      return loadFile('static/questions-all.json', function (error, result) {
        if (error) {
          callback(error);
        }
        callback(null, result);
      });
    }
    var test = db.collection('test');
    test.find().toArray(function (error, result) {
      if (error) {
        next(error);
      }
      result.sort(function (a, b) {
        return a.id.localeCompare(b.id);
      })
      callback(null, result);
    })
  });
}

function getQuestion(id, callback) {
  mongo.Db.connect(mongoUri, function (err, db) {
    var test = db.collection('test');
    test.find({id: id}).toArray(function (error, result) {
      if (error) {
        next(error);
      }
      callback(null, result[0]);
    })
  });
}

function saveQuestion(req, res) {
  var question = req.body;
  mongo.Db.connect(mongoUri, function (err, db) {
    var test = db.collection('test');
    test.update({id: question.id}, {$set: {question: question.question}}, {w: 1}, function (err, result) {
      if (result === 1) {
        res.render('updated', {question: question});
      } else {
        res.redirect('/questions/' + question.id + '/edit');
      }
    });
  });
}

app.get('/questions.json', function (req, res, next) {
  getQuestions(function (err, result) {
    if (err) {
      next(err);
    }
//    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.send('questions = ' + JSON.stringify(result));
  })
});

app.get('/questions/', basicAuth, function (req, res, next) {
  getQuestions(function (err, result) {
    res.render('index', {questions: result});
  })
});

app.get('/questions', basicAuth, function (req, res, next) {
  res.redirect('/questions/');
});

app.get('/questions/:id/edit', basicAuth, function (req, res) {
  getQuestion(req.params.id, function (err, result) {
    res.render('edit', {question: result});
  })
});

app.post('/questions/:id/submit', basicAuth, function (req, res) {
  saveQuestion(req, res);
});

var http = require('http');
var server = http.createServer(app);


server.listen(process.env.PORT || 5000, function () {
  console.log('Server running');
});
