/*global test_questions*/

describe('authors function', function () {
  "use strict";
  var questions;
  beforeEach(module('retroflection'));

  beforeEach(inject(function (authorService) {
    questions = authorService(test_questions);
  }));

  it('parses the test_questions to 7 authors', function () {
    expect(questions.length).toEqual(7);
  });

  it('contains Yves with 5 test_questions', function () {
    questions.forEach(function (question) {
      if (question.name === '@yveshanoulle') {
        expect(question.questions.length).toEqual(5);
      }
    });
  });

  it('sorts the authors by name', function () {
    var lastName = "";
    questions.forEach(function (question) {
      var currentName = question.name;
      expect(lastName.localeCompare(currentName)).toBeLessThan(0);
      lastName = currentName;
    });
  });
});
