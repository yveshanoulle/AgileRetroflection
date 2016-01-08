'use strict';
var expect = require('must');
var httpRequest = require('request');
var port = 5001;
var baseUri = 'http://localhost:' + port;

var app = require('../server/server');

describe('SWK Plattform server', function () {
  beforeEach(function (done) {
    app.start(port, done);
  });

  afterEach(function (done) {
    app.stop(done);
  });

  it('responds on a GET for the standard home page indicating appcaching', function (done) {
    httpRequest({uri: baseUri}, function (req, resp) {
      expect(resp).to.exist();
      expect(resp.statusCode).to.equal(200);
      expect(resp.body).to.contain('<body><div id="retroflection"></div><script src="/js/global.js"></script></body>');
      expect(resp.body).to.contain('<html manifest="retroflection.appcache">');
      done(); // without error check
    });
  });

  it('serves the app no matter what URL', function (done) {
    httpRequest({uri: baseUri + '/somethingWeird'}, function (req, resp) {
      expect(resp).to.exist();
      expect(resp.statusCode).to.equal(200);
      expect(resp.body).to.contain('<body><div id="retroflection"></div><script src="/js/global.js"></script></body>');
      expect(resp.body).to.contain('<html manifest="retroflection.appcache">');
      done(); // without error check
    });
  });

  it('responds on a GET for the online home page indicating NO appcaching', function (done) {
    httpRequest({uri: baseUri + '/online'}, function (req, resp) {
      expect(resp).to.exist();
      expect(resp.statusCode).to.equal(200);
      expect(resp.body).to.contain('<body><div id="retroflection"></div><script src="/js/global.js"></script></body>');
      expect(resp.body).to.contain('<html>');
      done(); // without error check
    });
  });

  it('serves the online app no matter what suffix', function (done) {
    httpRequest({uri: baseUri + '/online/somethingWeird'}, function (req, resp) {
      expect(resp).to.exist();
      expect(resp.statusCode).to.equal(200);
      expect(resp.body).to.contain('<body><div id="retroflection"></div><script src="/js/global.js"></script></body>');
      expect(resp.body).to.contain('<html>');
      done(); // without error check
    });
  });

});
