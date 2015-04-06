'use strict';

var app = require('./server');
var retrieve_questions = require('./retrieve-questions');
var fs = require('fs');

var server = require('http').createServer(app);

server.listen(process.env.PORT || 5000, function () {
  console.log('Server running');
});
retrieve_questions();
setInterval(retrieve_questions, 1000 * 60 * 60 * 24);
setInterval(function () {
  fs.exists('public/questions.json', function (exists) {
    if (!exists) { retrieve_questions(); }
  });
}, 1000 * 60); // check every minute if questions.json exists

