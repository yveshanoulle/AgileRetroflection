"use strict"

var express = require('express');
var path = require('path');
var app = express();

app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname)));
});

var http = require('http');
var server = http.createServer(app);

server.listen(process.env.PORT || 5000, function () {
  console.log('Server running');
});
