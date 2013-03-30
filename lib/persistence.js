var mongo = require('mongodb'),
  mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/retroflection?safe=true',
  Db = mongo.Db.connect(mongoUri, {noOpen: true}, function (err, db) {
  }),
  collectionName = 'questions';

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
        })
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
      test.update({id: question.id}, {$set: {question: question.question}}, {w: 1}, function (error, result) {
        db.close();
        if (error) {
          return callback(error);
        }
        callback(null, result);
      });
    });
  }
}