import { EventEmitter } from 'events';

import Questions from './repo/questionsRepository';
import { Dispatcher } from 'flux';

const QUESTIONS_LOADED = 'questionsLoaded';
const CHANGE_EVENT = 'change';
const questionsEE = new EventEmitter();

let questionsService = new Questions('[]');

const dispatcher = new Dispatcher();
dispatcher.register((action) => {
  if (action.type === QUESTIONS_LOADED) {
    questionsService = new Questions(action.rawQuestions);
    questionsEE.emit(CHANGE_EVENT);
  }
});

export function addChangeListener(callback) {
  questionsEE.on(CHANGE_EVENT, callback);
}

export function removeChangeListener(callback) {
  questionsEE.removeListener(CHANGE_EVENT, callback);
}

export function service() {
  return questionsService;
}

export function authorNamed(name) {
  return service().authorNamed(decodeURIComponent(name)) || {questions: []};
}

export function initQuestions() {
// trying to update the questions from server, fallback is local storage
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {

    const localStorageKey = 'questions';
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        localStorage.setItem(localStorageKey, xmlhttp.response);
      }
      dispatcher.dispatch({type: QUESTIONS_LOADED, rawQuestions: localStorage.getItem(localStorageKey)});
    }
  };
  xmlhttp.open('GET', '/questions.json', true);
  xmlhttp.send();
}

