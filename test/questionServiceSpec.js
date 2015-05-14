'use strict';

var expect = require('must');

var questionStore = require('../src/questionsStore').store;
var testQuestions = require('./test-questions.json');

describe('the QuestionService', function () {
  var service = questionStore(JSON.stringify(testQuestions));

  it('chooses the same question for previous after initial question', function () {
    var current = service.next();
    expect(current + 1).to.be.truthy();
    expect(service.previous()).to.be(current);
  });

  it('chooses the previous question for previous after second question', function () {
    var first = service.next();
    service.next();
    expect(service.previous()).to.be(first);
  });

});
