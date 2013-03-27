var
  async = require('async'),
  connectRoute = require('connect-route'),
  connect = require('connect'),
  app = connect(),
  fs = require('fs'),
  quest = [];

var readdir = function(dir, cb) {
  fs.readdir(dir, function(err, files) {
    if (err) return cb(err);
    files = files.map(function(file) {
      return dir + '/' + file;
    });
    cb(null, files);
  });
};

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


function initQuestions() {
  readdir('questionstore', function (err, files) {
    if (err) {
      return cb(err);
    }
    var fileLoaders = files.map(function (file) {
      return function (cb) {
        loadFile(file, cb);
      };
    });
    async.parallelLimit(fileLoaders, 50, function (err, objs) {
      if (err) {
        throw err;
      }
      quest = objs;
    });
  })
}

initQuestions();

app.use(connectRoute(function (router) {
  router.get('questions.json', function (req, res, next) {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end('questions = ' + JSON.stringify(quest));
  });

}));
app.use(connect.static(__dirname));

app.listen(process.env.PORT || 5000);
