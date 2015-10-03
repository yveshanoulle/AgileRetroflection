'use strict';

var appMechanics = require('./appMechanics');
var appDispatcher = appMechanics.dispatcher;
var questionsRepository = require('./questionsRepository');
var questionsService = questionsRepository('[]');

var CHANGE_EVENT = 'change';
var EventEmitter = require('events').EventEmitter;

var questionsEE = new EventEmitter();



function questionsLoaded(questionstring) {
  questionsService = questionsRepository(questionstring);
  questionsEE.emit(CHANGE_EVENT);
}

appDispatcher.register(function (action) {
  if (action.type === appMechanics.actionsTypes.QUESTIONS_LOADED) {
    return questionsLoaded(action.rawQuestions);
  }
});

module.exports = {
  addChangeListener: function (callback) { questionsEE.on(CHANGE_EVENT, callback); },
  removeChangeListener: function (callback) { questionsEE.removeListener(CHANGE_EVENT, callback); },
  service: function () { return questionsService; }
};
