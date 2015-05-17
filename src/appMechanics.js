'use strict';
var Dispatcher = require('flux').Dispatcher;
var appDispatcher = new Dispatcher();

var actionsTypes = {
  QUESTIONS_LOADED: 'questionsLoaded'
};

function questionsLoaded(rawQuestions) {
  appDispatcher.dispatch({
    type: actionsTypes.QUESTIONS_LOADED,
    rawQuestions: rawQuestions
  });
}

function loadQuestions() {
// trying to update the questions from server, fallback is local storage
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) { localStorage.setItem('questions', xmlhttp.response); }
      questionsLoaded(localStorage.getItem('questions'));
    }
  };
  xmlhttp.open('GET', '/questions.json', true);
  xmlhttp.send();
}

module.exports = {
  questionsLoaded: questionsLoaded,
  actionsTypes: actionsTypes,
  dispatcher: appDispatcher,
  loadQuestions: loadQuestions
};

