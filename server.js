"use strict";

var express = require('express');
var path = require('path');
var app = express();
var retrieve_questions = require('./retrieve-questions');

app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));

var server = require('http').createServer(app);

server.listen(process.env.PORT || 5000, function () {
  console.log('Server running');
});
retrieve_questions();
setInterval(retrieve_questions, 1000 * 60 * 60 * 24);
