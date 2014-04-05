"use strict";

var Spreadsheet = require('edit-google-spreadsheet');
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');

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

    spreadsheet.receive(function (err, rows, info) {
      if (err) { throw err; }
      console.log(info);
    });
  });
}

loadSheet('Questions');
