'use strict';

var authorsService = require('./authorsService');

module.exports = function (questionstring) {

  var
    questionjson = JSON.parse(questionstring),
    questionNumbers = [];

  function currentQuestionNumber() {
    return questionNumbers[questionNumbers.length - 1] || 0;
  }

  function nextQuestion() {
    questionNumbers.push(Math.floor(Math.random() * questionjson.length));
    return currentQuestionNumber();
  }

  function previousQuestion() {
    if (questionNumbers.length > 1) {
      questionNumbers.pop();
    }
    return currentQuestionNumber();
  }

  return {
    next: nextQuestion,
    previous: previousQuestion,
    all: questionjson,
    authors: authorsService(questionjson)
  };
};
