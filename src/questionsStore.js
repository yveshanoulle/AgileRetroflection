import { EventEmitter } from 'events';

import { dispatcher, actionTypes } from './appMechanics';
import questionsRepository from './questionsRepository';

let questionsService = questionsRepository('[]');

const CHANGE_EVENT = 'change';

const questionsEE = new EventEmitter();

const dispatchToken = dispatcher.register((action) => {
  if (action.type === actionTypes.QUESTIONS_LOADED) {
    questionsService = questionsRepository(action.rawQuestions);
    questionsEE.emit(CHANGE_EVENT);
  }
});

export const store = {
  addChangeListener: function (callback) { questionsEE.on(CHANGE_EVENT, callback); },
  removeChangeListener: function (callback) { questionsEE.removeListener(CHANGE_EVENT, callback); },
  dispatchToken: dispatchToken,
  service: function service() { return questionsService; },
  authorNamed: function (name) { return questionsService.authorNamed(decodeURIComponent(name)) || {questions: []}; }
};
