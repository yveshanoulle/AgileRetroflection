'use strict';

var expect = require('must');

var questionsRepository = require('../src/questionsRepository');
var testQuestions = require('./test-questions.json');

describe('the QuestionService', function () {
  var service = questionsRepository(JSON.stringify(testQuestions));

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

describe('authors function', function () {
  var service = questionsRepository(JSON.stringify(testQuestions)).authors;

  it('parses the test_questions to 8 distinct authors strings', function () {
    expect(service.all.length).to.be(8);
  });

  it('parses the test_questions to 7 distinct authors', function () {
    expect(service.distinct().length).to.be(7);
  });

  it('contains Yves with 5 test_questions', function () {
    service.all.forEach(function (question) {
      if (question.name === '@yveshanoulle') {
        expect(question.questions.length).to.be(4);
      }
    });
  });

  it('sorts the authors by name', function () {
    var lastName = '';
    service.all.forEach(function (question) {
      var currentName = question.name;
      expect(lastName.localeCompare(currentName)).to.be.below(0);
      lastName = currentName;
    });
  });
});
