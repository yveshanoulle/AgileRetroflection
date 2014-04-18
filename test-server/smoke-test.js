var child_process = require("child_process");
var should = require('chai').should();
var request = require('request');
var port = 5000;
var base_uri = "http://localhost:" + port;

describe('Server', function () {
  var child;

  var waitForServerRunning = function (child, callback) {
    var stdout = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (chunk) {
      stdout += chunk;
      if (stdout.trim().indexOf('Server running') === 0) {
        /* prevent callback being called multiple times */
        stdout = "";
        callback();
      }
    });
  };

  var serverShouldDeliverStartPage = function (done) {
    request({uri: base_uri}, function (req, resp) {
      resp.statusCode.should.equal(200);
      resp.body.should.contain('ng-app="retroflection"');
      done();
    });
  };

  afterEach(function (done) {
    child.on("exit", function () {
      done();
    });
    child.kill();
  });

  it('delivers the home page when server.js is called', function (done) {
    child = child_process.spawn("node", ["server.js", "--port", port], { cwd: __dirname + "/../", stdio: "pipe" });
    waitForServerRunning(child, function () {
      serverShouldDeliverStartPage(done);
    });
  });

});
