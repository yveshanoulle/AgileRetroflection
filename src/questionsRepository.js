'use strict';

var _ = require('lodash');

var appMechanics = require('./appMechanics');
var appDispatcher = appMechanics.dispatcher;
var questionsService = questionsStore('[]');

var CHANGE_EVENT = 'change';
var EventEmitter = require('events').EventEmitter;

var questionsEE = new EventEmitter();


function authorsService (questions) {
  var internal = [];

  function addAuthor(author) {
    internal.push({name: author, questions: []});
  }

  function getAuthorNamed(name) {
    return _.find(internal, {name: name});
  }

  _.each(questions, function (question) {
    var name = question.author;
    if (!getAuthorNamed(name)) {
      addAuthor(name);
    }
    getAuthorNamed(name).questions.push(question);
  });

  internal.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  return {
    all: internal,
    distinct: function () {
      return _(internal).pluck('name').map(function (each) {
        return each.match(/@(\w+)/g);
      }).flatten().unique().value();
    },
    authorNamed: getAuthorNamed
  };
}



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
