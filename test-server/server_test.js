"use strict";
var expect = require('must');
var httpRequest = require('request');
var port = 5001;
var base_uri = "http://localhost:" + port;

var app = require('../server');

describe('SWK Plattform server', function () {
  beforeEach(function (done) {
    app.start(port, done);
  });

  afterEach(function (done) {
    app.stop(done);
  });

  it('responds on a GET for the standard home page indicating appcaching', function (done) {
    httpRequest({uri: base_uri}, function (req, resp) {
      expect(resp).to.exist();
      expect(resp.statusCode).to.equal(200);
      expect(resp.body).to.contain('<body ng-app="retroflection"><div ui-view></div></body>');
      expect(resp.body).to.contain('<html manifest="retroflection.appcache">');
      done(); // without error check
    });
  });

  it('responds on a GET for the online home page indicating NO appcaching', function (done) {
    httpRequest({uri: base_uri + '/online'}, function (req, resp) {
      expect(resp).to.exist();
      expect(resp.statusCode).to.equal(200);
      expect(resp.body).to.contain('<body ng-app="retroflection"><div ui-view></div></body>');
      expect(resp.body).to.contain('<html>');
      done(); // without error check
    });
  });

});
