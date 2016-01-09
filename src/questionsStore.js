import { EventEmitter } from 'events';

import questionsStore from './questionsRepository';
import { Dispatcher } from 'flux';

const QUESTIONS_LOADED = 'questionsLoaded';
const CHANGE_EVENT = 'change';
const questionsEE = new EventEmitter();

let questionsService = questionsStore('[]');

const dispatcher = new Dispatcher();
dispatcher.register((action) => {
  if (action.type === QUESTIONS_LOADED) {
    questionsService = questionsStore(action.rawQuestions);
    questionsEE.emit(CHANGE_EVENT);
  }
});

export const store = {
  addChangeListener: function (callback) { questionsEE.on(CHANGE_EVENT, callback); },
  removeChangeListener: function (callback) { questionsEE.removeListener(CHANGE_EVENT, callback); },
  service: function service() { return questionsService; },
  authorNamed: function (name) { return questionsService.authorNamed(decodeURIComponent(name)) || {questions: []}; }
};


export function initQuestions() {
// trying to update the questions from server, fallback is local storage
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    function questionsLoaded(rawQuestions) {
      dispatcher.dispatch({type: QUESTIONS_LOADED, rawQuestions: rawQuestions});
    }

    const localStorageKey = 'questions';
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        localStorage.setItem(localStorageKey, xmlhttp.response);
      }
      questionsLoaded(localStorage.getItem(localStorageKey));
    }
  };
  xmlhttp.open('GET', '/questions.json', true);
  xmlhttp.send();
}

