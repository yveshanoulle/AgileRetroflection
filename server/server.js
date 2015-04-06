'use strict';

var express = require('express');
var path = require('path');
var app = express();
var useragent = require('useragent');
var favicon = require('serve-favicon');
var compress = require('compression');
var serveStatic = require('serve-static');
var server;

function detectBrowser(req, res, next) {
  res.locals.ios = !!useragent.parse(req.headers['user-agent']).os.family.match(/iOS|iPhone|iPad|iPod/);
  res.locals.android = !!useragent.parse(req.headers['user-agent']).os.family.match(/Android/);
  next();
}

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, '../public/images/favicon.ico')));
app.use(detectBrowser);
app.use(compress());
app.use(serveStatic(path.join(__dirname, '../public')));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/online', function (req, res) {
  res.render('index-online');
});

app.start = function (port, done) {
  server = require('http').createServer(this);
  server.listen(port || process.env.PORT || 5000, function () {
    console.log('Server started');
    if (done) { done(); }
  });
};

app.stop = function (done) {
  server.close(function () {
    console.log('Server stopped');
    if (done) { done(); }
  });
};

module.exports = app;
