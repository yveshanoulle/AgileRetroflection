'use strict';

var authorsService = require('./authorsService');
var appMechanics = require('./appMechanics');
var appDispatcher = appMechanics.dispatcher;
var questionsService = questionsStore('[]');

var CHANGE_EVENT = 'change';
var EventEmitter = require('events').EventEmitter;

var questionsEE = new EventEmitter();

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
  questionsEE.emit(CHANGE_EVENT);
}

appDispatcher.register(function (action) {
  if (action.type === appMechanics.actionsTypes.QUESTIONS_LOADED) {
    return questionsLoaded(action.rawQuestions);
  }
});

module.exports = {
  store: questionsStore,
  addChangeListener: function (callback) { questionsEE.on(CHANGE_EVENT, callback); },
  removeChangeListener: function (callback) { questionsEE.removeListener(CHANGE_EVENT, callback); },
  service: function () { return questionsService; }
};
