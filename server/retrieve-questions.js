'use strict';

const Spreadsheet = require('edit-google-spreadsheet');
const _ = require('lodash');
const fs = require('fs');
const moment = require('moment');
const async = require('async');

const nconf = require('nconf');
nconf.argv();
nconf.env();
nconf.file({file: 'config/emailAndKey.json'});

function loadSheet(worksheetId, idCol, questionCol, authorCol, dateCol, callback) {
  const key = nconf.get('GOOGLE_PEM');
  const email = nconf.get('GOOGLE_DEV_EMAIL');
  if (!key || !email) { return callback(new Error()); }
  Spreadsheet.load({
    spreadsheetId: '0AjzWaZIjE9dYdFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE',
    worksheetId: worksheetId,

    oauth: {
      email: email,
      key: key
    }

  }, (err, spreadsheet) => {
    if (err) { return callback(err); }

    spreadsheet.receive({getValues: true}, (err1, rows) => {
      if (err1) { return callback(err1); }
      callback(null, _(rows).filter((row) => {
        return !!row[dateCol] && moment(row[dateCol], 'M/D/YYYY').add(1, 'days').isBefore(moment());
      }).map((row) => {
        const questionrow = {};
        questionrow.id = row[idCol] ? row[idCol].toString() : '';
        questionrow.question = row[questionCol];
        questionrow.author = row[authorCol];
        questionrow.date = row[dateCol];
        return questionrow;
      }).filter((row) => {
        return !!row.author && row.author.match(/^@/);
      }).value());
    });
  });
}

module.exports = () => {
  async.parallel(
    [
      (callback) => {
        loadSheet('od9', '2', '4', '5', '9', callback);
      },
      (callback) => {
        loadSheet('od8', '2', '4', '5', '9', callback);
      },
      (callback) => {
        loadSheet('odb', '2', '4', '5', '9', callback);
      },
      (callback) => {
        loadSheet('ocx', '1', '3', '4', '8', callback);
      },
      (callback) => {
        loadSheet('od6', '1', '3', '4', '7', callback);
      },
      (callback) => {
        loadSheet('od0', '1', '3', '4', '7', callback);
      }
    ],
    (err, questions) => {
      if (err) {
        return err;
      }
      let sortedQuestions = _.flatten(questions).sort((question1, question2) => {
        return parseInt(question1.id, 10) - parseInt(question2.id, 10);
      });
      fs.writeFile('public/questions.json', JSON.stringify(sortedQuestions), (err1) => {
        /* eslint no-console: 0 */
        if (err1) {
          return console.log(err1);
        }
        console.log('questions updated');
      });
    }
  );
};

