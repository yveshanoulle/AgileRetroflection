'use strict';

var Spreadsheet = require('edit-google-spreadsheet');
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
var async = require('async');

var nconf = require('nconf');
nconf.argv();
nconf.env();
nconf.file({file: 'config/emailAndKey.json'});

function loadSheet(worksheetId, idCol, questionCol, authorCol, dateCol, callback) {
  var key = nconf.get('GOOGLE_PEM');
  var email = nconf.get('GOOGLE_DEV_EMAIL');
  if (!key || !email) { return callback(new Error()); }
  Spreadsheet.load({
    spreadsheetId: '0AjzWaZIjE9dYdFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE',
    worksheetId: worksheetId,

    oauth: {
      email: email,
      key: key
    }

  }, function sheetReady(err, spreadsheet) {
    if (err) { return callback(err); }

    spreadsheet.receive({getValues: true}, function (err1, rows) {
      if (err1) { return callback(err1); }
      callback(null, _(rows).filter(function (row) {
        return !!row[dateCol] && moment(row[dateCol], 'M/D/YYYY').add(1, 'days').isBefore(moment());
      }).map(function (row) {
        var questionrow = {};
        questionrow.id = row[idCol] ? row[idCol].toString() : '';
        questionrow.question = row[questionCol];
        questionrow.author = row[authorCol];
        questionrow.date = row[dateCol];
        return questionrow;
      }).filter(function (row) {
        return !!row.author && row.author.match(/^@/);
      }).value());
    });
  });
}

module.exports = function () {
  async.parallel(
    [
      function (callback) {
        loadSheet('od9', '2', '4', '5', '9', callback);
      },
      function (callback) {
        loadSheet('od8', '2', '4', '5', '9', callback);
      },
      function (callback) {
        loadSheet('odb', '2', '4', '5', '9', callback);
      },
      function (callback) {
        loadSheet('ocx', '1', '3', '4', '8', callback);
      },
      function (callback) {
        loadSheet('od6', '1', '3', '4', '7', callback);
      },
      function (callback) {
        loadSheet('od0', '1', '3', '4', '7', callback);
      }
    ],
    function (err, questions) {
      if (err) {
        return err;
      }
      var sortedQuestions = _.flatten(questions).sort(function (question1, question2) {
        return parseInt(question1.id, 10) - parseInt(question2.id, 10);
      });
      fs.writeFile('public/questions.json', JSON.stringify(sortedQuestions), function (err1) {
        /* eslint no-console: 0 */
        if (err1) {
          return console.log(err1);
        }
        console.log('questions updated');
      });
    }
  );
};

