'use strict';
/*
 * Use this file to retrieve metadata for new pages in the spreadsheet and then transfer the info to retrieve-questions.js
 */

var Spreadsheet = require('edit-google-spreadsheet');

var nconf = require('nconf');
nconf.argv();
nconf.env();
nconf.file({ file: 'config/emailAndKey.json' });

function loadSheet(worksheetId) {
  var key = nconf.get('GOOGLE_PEM');
  var email = nconf.get('GOOGLE_DEV_EMAIL');
  Spreadsheet.load({
    spreadsheetId: '0AjzWaZIjE9dYdFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE',
    worksheetName: worksheetId,

    oauth: {
      email: email,
      key: key
    }

  }, function sheetReady(err, spreadsheet) {
    if (err) { throw err; }

    spreadsheet.receive(function (err1, rows, info) {
      /* eslint no-console: 0 */
      if (err1) { throw err1; }
      console.log(info);
    });
  });
}

loadSheet('Questions 2014');
