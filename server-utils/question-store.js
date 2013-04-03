var
  async = require('async'),
  fs = require('fs'),
  quest = [];

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/retroflection';

var readdir = function (dir, cb) {
  fs.readdir(dir, function (err, files) {
    if (err) {
      return cb(err);
    }
    files = files.map(function (file) {
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

mongo.Db.connect(mongoUri + '?safe=true', function (err, db) {
  var test = db.collection('questions');
  test.remove({}, function (err, result) {

  });
  test.insert(quest, function (err, result) {

  });
  test.find().toArray(function (err, result) {
    console.log(result.length);
  })
});