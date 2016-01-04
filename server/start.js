'use strict';

var app = require('./server');
var retrieveQuestions = require('./retrieve-questions');
var fs = require('fs');

var server = require('http').createServer(app);

server.listen(process.env.PORT || 5000, function () {
  /* eslint no-console: 0 */
  console.log('Server running');
});
retrieveQuestions();
setInterval(retrieveQuestions, 1000 * 60 * 60 * 24);
setInterval(function () {
  fs.exists('public/questions.json', function (exists) {
    if (!exists) { retrieveQuestions(); }
  });
}, 1000 * 60); // check every minute if questions.json exists

