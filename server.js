"use strict";

var express = require('express');
var path = require('path');
var app = express();
var retrieve_questions = require('./retrieve-questions');
var useragent = require('useragent');
var jade = require("jade");

function detectBrowser(req, res, next) {
  res.locals.ios = !!useragent.parse(req.headers['user-agent']).os.family.match(/iOS|iPhone|iPad|iPod/);
  res.locals.android = !!useragent.parse(req.headers['user-agent']).os.family.match(/Android/);
  next();
}

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(detectBrowser);
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index');
});

var server = require('http').createServer(app);

server.listen(process.env.PORT || 5000, function () {
  console.log('Server running');
});
retrieve_questions();
setInterval(retrieve_questions, 1000 * 60 * 60 * 24);

