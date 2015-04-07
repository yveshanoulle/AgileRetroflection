/*global test_questions*/

describe('authors function', function () {
  'use strict';
  var service;
  beforeEach(module('retroflection'));

  beforeEach(inject(function (authorService) {
    service = authorService(test_questions);
  }));

  it('parses the test_questions to 8 distinct authors strings', function () {
    expect(service.all.length).toEqual(8);
  });

  it('parses the test_questions to 7 distinct authors', function () {
    expect(service.distinct().length).toEqual(7);
  });

  it('contains Yves with 5 test_questions', function () {
    service.all.forEach(function (question) {
      if (question.name === '@yveshanoulle') {
        expect(question.questions.length).toEqual(4);
      }
    });
  });

  it('sorts the authors by name', function () {
    var lastName = '';
    service.all.forEach(function (question) {
      var currentName = question.name;
      expect(lastName.localeCompare(currentName)).toBeLessThan(0);
      lastName = currentName;
    });
  });
});
