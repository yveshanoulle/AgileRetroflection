'use strict';

var EventEmitter = require('events').EventEmitter;

var appMechanics = require('./appMechanics');
var appDispatcher = appMechanics.dispatcher;
var questionsRepository = require('./questionsRepository');
var questionsService = questionsRepository('[]');

var CHANGE_EVENT = 'change';

var questionsEE = new EventEmitter();

var dispatchToken = appDispatcher.register(function (action) {
  if (action.type === appMechanics.actionTypes.QUESTIONS_LOADED) {
    questionsService = questionsRepository(action.rawQuestions);
    questionsEE.emit(CHANGE_EVENT);
  }
});

var store = {
  template: template,
  addChangeListener: function (callback) { questionsEE.on(CHANGE_EVENT, callback); },
  removeChangeListener: function (callback) { questionsEE.removeListener(CHANGE_EVENT, callback); },
  dispatchToken: dispatchToken,
  service: function service() { return questionsService; },
  authorNamed: function (name) { return questionsService.authorNamed(name); }
};

function template() {
  return {
    getInitialState: function () { return store.service(); },
    componentDidMount: function () { store.addChangeListener(this.onChange); },
    componentWillUnmount: function () { store.removeChangeListener(this.onChange); },
    onChange: function () { this.setState(store.service()); }
  };
}

module.exports = store;
