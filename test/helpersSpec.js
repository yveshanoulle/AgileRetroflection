/*global test_questions*/

"use strict";

describe('helpers function for standard emails', function () {
  var result;
  var question = test_questions[0];
  beforeEach(function () {
    result = createMailURL(question);
  });

  it('creates mailto: without address', function () {
    expect(result).toMatch('mailto:?');
  });

  it('contains the question text', function () {
    expect(result).toMatch(question.question);
  });

  it('contains the question author', function () {
    expect(result).toMatch(question.author);
  });

  it('contains the question id', function () {
    expect(result).toMatch(question.id);
  });
});

describe('helpers function for correction emails', function () {
  var result;
  var question = test_questions[0];
  beforeEach(function () {
    result = createCorrectionMailURL(question);
  });

  it('creates mailto: with address "retroflections@hanoulle.be"', function () {
    expect(result).toMatch('mailto:retroflections@hanoulle.be?');
  });

  it('contains the question text', function () {
    expect(result).toMatch(question.question);
  });

  it('contains the question author', function () {
    expect(result).toMatch(question.author);
  });

  it('contains the question id', function () {
    expect(result).toMatch(question.id);
  });
});
