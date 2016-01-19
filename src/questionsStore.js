import { EventEmitter } from 'events';

import Questions from './repo/questionsRepository';
import { Dispatcher } from 'flux';

export const QUESTIONS_LOADED = 'questionsLoaded'; // for test
export const AUTHOR_IMAGES_LOADED = 'authorImagesLoaded'; // for test
const CHANGE_EVENT = 'change';
const questionsEE = new EventEmitter();

export const questionsService = new Questions();

export const dispatcher = new Dispatcher(); // for test
dispatcher.register((action) => {
  if (action.type === QUESTIONS_LOADED) {
    questionsService.initQuestions(action.rawQuestions);
    questionsEE.emit(CHANGE_EVENT);
  }
  if (action.type === AUTHOR_IMAGES_LOADED) {
    questionsService.initAuthorImages(action.rawAuthorImages);
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
  return questionsService.authorNamed(decodeURIComponent(name)) || {name: '', questions: []};
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

export function initAuthorImages() {
// trying to update the questions from server, fallback is local storage
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {

    const localStorageKey = 'authorImages';
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        localStorage.setItem(localStorageKey, xmlhttp.response);
      }
      dispatcher.dispatch({type: AUTHOR_IMAGES_LOADED, rawAuthorImages: localStorage.getItem(localStorageKey)});
    }
  };
  xmlhttp.open('GET', '/twitterImages.json', true);
  xmlhttp.send();
}

