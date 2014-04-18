/*global test_questions, inject*/

"use strict";

describe('authors function', function () {
  var questions;
  beforeEach(module('retroflection'));

  beforeEach(inject(function (authorService) {
    questions = authorService(test_questions);
  }));

  it('parses the test_questions to 7 authors', function () {
    expect(questions.length).toEqual(7);
  });

  it('contains Yves with 5 test_questions', function () {
    for (var i in questions) {
      if (questions[i].name === '@yveshanoulle') {
        expect(questions[i].questions.length).toEqual(5);
      }
    }
  });

  it('sorts the authors by name', function () {
    var lastName = "";
    for (var i in questions) {
      var currentName = questions[i].name;
      expect(lastName.localeCompare(currentName)).toBeLessThan(0);
      lastName = currentName;
    }
  });
});
