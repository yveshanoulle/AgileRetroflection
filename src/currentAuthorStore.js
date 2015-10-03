'use strict';

var appMechanics = require('./appMechanics');
var appDispatcher = appMechanics.dispatcher;
var questionsStore = require('./questionsStore');

var CHANGE_EVENT = 'change';
var EventEmitter = require('events').EventEmitter;

var authorEE = new EventEmitter();

function refresh() {
  authorEE.emit(CHANGE_EVENT);
}

appDispatcher.register(function (action) {
  if (action.type === appMechanics.actionTypes.QUESTIONS_LOADED) {
    appDispatcher.waitFor([questionsStore.dispatchToken]);
    return refresh();
  }
});

module.exports = {
  addChangeListener: function (callback) { authorEE.on(CHANGE_EVENT, callback); },
  removeChangeListener: function (callback) { authorEE.removeListener(CHANGE_EVENT, callback); },
  authorNamed: function (name) { return questionsStore.authorNamed(decodeURIComponent(name)) || {questions: []}; }
};
