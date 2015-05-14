'use strict';

var authorsService = require('./authorsService');
var Dispatcher = require('flux').Dispatcher;
var appDispatcher = new Dispatcher();
var questionsService = questionsStore('[]');

function questionsStore(questionstring) {

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

  var authors = authorsService(questionjson);

  return {
    next: nextQuestion,
    previous: previousQuestion,
    all: questionjson,
    authors: authors,
    authorNamed: authors.authorNamed
  };
}

function questionsLoaded(questionstring) {
  questionsService = questionsStore(questionstring);
  appDispatcher.dispatch(questionsService);
}

function loadQuestions() {
// trying to update the questions from server, fallback is local storage
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        var data = xmlhttp.response;
        localStorage.setItem('questions', data);
        questionsLoaded(data);
      } else {
        questionsLoaded(localStorage.getItem('questions'));
      }
    }
  };
  xmlhttp.open('GET', '/questions.json', true);
  xmlhttp.send();
}


module.exports.store = questionsStore; // to make it testable
module.exports.appDispatcher = appDispatcher;
module.exports.loadQuestions = loadQuestions;
module.exports.service = function () { return questionsService; };
