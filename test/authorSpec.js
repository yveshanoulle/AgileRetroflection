'use strict';

var expect = require('must');

var testQuestions = require('./test-questions.json');
var authorService = require('../src/authorsService');

describe('authors function', function () {
  var service;
  beforeEach(function () {
    service = authorService(testQuestions);
  });

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
