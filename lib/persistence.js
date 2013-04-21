var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/retroflection?safe=true';
var Db = mongo.Db.connect(mongoUri, {noOpen: true}, function () {
});
var collectionName = 'questions';

module.exports = {
  getQuestions: function getQuestions(callback) {
    Db.open(function (err, db) {
      var test = db.collection(collectionName);
      test.find().toArray(function (error, result) {
        db.close();
        if (error) {
          return callback(error);
        }
        result.sort(function (a, b) {
          return a.id.localeCompare(b.id);
        });
        callback(null, result);
      });
    });
  },

  getQuestionsSince: function getQuestionsSince(lastSave, callback) {
    Db.open(function (err, db) {
      var test = db.collection(collectionName);
      test.find({lastSave: {$gt: lastSave}}).toArray(function (error, result) {
        db.close();
        if (error) {
          return callback(error);
        }
        result.forEach(function(question) {
          question._id = undefined;
        });
        result.sort(function (a, b) {
          return a.id.localeCompare(b.id);
        });
        callback(null, result);
      });
    });
  },

  getQuestion: function getQuestion(id, callback) {
    Db.open(function (err, db) {
      var test = db.collection(collectionName);
      test.find({id: id}).toArray(function (error, result) {
        db.close();
        if (error) {
          return callback(error);
        }
        callback(null, result[0]);
      });
    });
  },

  saveQuestion: function saveQuestion(question, callback) {
    Db.open(function (err, db) {
      var test = db.collection(collectionName);
      test.update({id: question.id}, {$set: {question: question.question, lastSave: Date.now()}}, {w: 1}, function (error, result) {
        db.close();
        if (error) {
          return callback(error);
        }
        callback(null, result);
      });
    });
  }
};
