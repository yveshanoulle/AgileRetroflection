/*global test_questions*/

"use strict";

describe('author Yves', function () {
  var authorName = '@yveshanoulle';
  var author = new Author(authorName);

  beforeEach(function () {
    author = new Author(authorName);
    for (var i in test_questions) {
      if (test_questions[i].author === authorName) {
        author.addQuestion(test_questions[i]);
      }
    }
  });

  it('has 5 test_questions', function () {
    expect(author.questions.length).toEqual(5);
  });

});

describe('authors function', function () {
  var result;
  beforeEach(function () {
    result = authors(test_questions);
  });

  it('parses the test_questions to 7 authors', function () {
    expect(result.length).toEqual(7);
    for (var i in result) {
      expect(result[i]).toEqual(jasmine.any(Author));
    }
  });

  it('contains Yves with 5 test_questions', function () {
    for (var i in result) {
      if (result[i].name === '@yveshanoulle') {
        expect(result[i].questions.length).toEqual(5);
      }
    }
  });

  it('sorts the authors by name', function () {
    var lastName = "";
    for (var i in result) {
      var currentName = result[i].name;
      expect(lastName.localeCompare(currentName)).toBeLessThan(0);
      lastName = currentName;
    }
  });
});
