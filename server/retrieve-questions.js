'use strict';

const Spreadsheet = require('edit-google-spreadsheet');
const fs = require('fs');
const moment = require('moment');
const async = require('async');

const nconf = require('./init-nconf');
const twitteravatar = require('./twitteravatar');
const twitterAPI = require('./twitterAPI');

function loadSheet(worksheetId, idCol, questionCol, authorCol, dateCol, callback) {
  const key = nconf.get('GOOGLE_PEM');
  const email = nconf.get('GOOGLE_DEV_EMAIL');
  if (!key || !email) { return callback(new Error()); }
  Spreadsheet.load({
    spreadsheetId: '0AjzWaZIjE9dYdFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE',
    worksheetId: worksheetId,
    oauth: {email: email, key: key}
  }, (err, spreadsheet) => {
    if (err) { return callback(err); }
    spreadsheet.receive({getValues: true}, (err1, rowsObject) => {
      console.log(JSON.stringify(rowsObject));
      if (err1) { return callback(err1); }
      let rowsArray = Object.keys(rowsObject).map(k => rowsObject[k]);
      callback(null, rowsArray
        .filter(row => !!row[dateCol] && moment(row[dateCol], 'M/D/YYYY').add(1, 'days').isBefore(moment()))
        .map(row => {
          const questionrow = {};
          questionrow.id = row[idCol] ? row[idCol].toString() : '';
          questionrow.question = row[questionCol];
          questionrow.author = row[authorCol];
          questionrow.date = row[dateCol];
          return questionrow;
        })
        .filter(row => !!row.author && row.author.match(/^@/)));
    });
  });
}

module.exports = () => {
  async.parallel(
    [
      callback => loadSheet('od9', '2', '4', '5', '9', callback),
      callback => loadSheet('od8', '2', '4', '5', '9', callback),
      callback => loadSheet('odb', '2', '4', '5', '9', callback),
      callback => loadSheet('ocx', '1', '3', '4', '8', callback),
      callback => loadSheet('od6', '1', '3', '4', '7', callback),
      callback => loadSheet('od0', '1', '3', '4', '7', callback)
    ],
    (err, questions) => {
      if (err) { return err; }
      let sortedQuestions = questions.reduce((a, b) => a.concat(b)).sort((question1, question2) => (parseInt(question1.id, 10) - parseInt(question2.id, 10)));
      const stringifiedQuestions = JSON.stringify(sortedQuestions);
      fs.writeFile('public/questions.json', stringifiedQuestions, err1 => {
        /* eslint no-console: 0 */
        if (err1) { return console.log(err1); }
        twitteravatar(twitterAPI, stringifiedQuestions).retrieveImageURLs((err2, urls) => {
          if (err2) { return console.log(err2); }
          fs.writeFile('public/twitterImages.json', JSON.stringify(urls), err3 => {
            if (err3) { console.log(err3); }
          });
        });
        console.log('questions updated');
      });
    }
  );
};

