'use strict';
/* eslint no-console: 0 */

const express = require('express');
const path = require('path');
const app = express();
const useragent = require('useragent');
const favicon = require('serve-favicon');
const compress = require('compression');
const serveStatic = require('serve-static');
let server;

function detectBrowser(req, res, next) {
  res.locals.ios = !!useragent.parse(req.headers['user-agent']).os.family.match(/iOS|iPhone|iPad|iPod/);
  res.locals.android = !!useragent.parse(req.headers['user-agent']).os.family.match(/Android/);
  next();
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, '../public/images/favicon.ico')));
app.use(detectBrowser);
app.use(compress());
app.use(serveStatic(path.join(__dirname, '../public')));

app.get('/', (req, res) => res.render('index'));

app.get('/online', (req, res) => res.render('index-online'));

app.get('/online/*', (req, res) => res.render('index-online'));

app.get('*', (req, res) => res.render('index'));


app.start = function (port, done) {
  server = require('http').createServer(this);
  const realPort = port || process.env.PORT || 5000;
  server.listen(realPort, () => {
    console.log('Server started on port: ' + realPort);
    done();
  });
};

app.stop = done => {
  server.close(() => {
    console.log(' Server stopped\n');
    done();
  });
};

module.exports = app;
