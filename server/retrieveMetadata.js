'use strict';
/*
 * Use this file to retrieve metadata for new pages in the spreadsheet and then transfer the info to retrieve-questions.js
 */

const Spreadsheet = require('edit-google-spreadsheet');

const nconf = require('./init-nconf');

function loadSheet(worksheetId) {
  const key = nconf.get('GOOGLE_PEM');
  const email = nconf.get('GOOGLE_DEV_EMAIL');
  Spreadsheet.load({
    spreadsheetId: '0AjzWaZIjE9dYdFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE',
    worksheetName: worksheetId,
    oauth: {
      email: email,
      key: key
    }
  }, (err, spreadsheet) => {
    if (err) { throw err; }

    spreadsheet.receive((err1, rows, info) => {
      /* eslint no-console: 0 */
      if (err1) { throw err1; }
      console.log(info);
    });
  });
}

loadSheet('Questions 2015');
