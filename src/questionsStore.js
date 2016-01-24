import { EventEmitter } from 'events';

import Questions from './repo/questionsRepository';

const CHANGE_EVENT = 'change';
const questionsEE = new EventEmitter();

export const questionsService = new Questions();

export const dispatcher = {  // exported for test
  questionsLoaded: (rawQuestions) => {
    questionsService.initQuestions(rawQuestions);
    questionsEE.emit(CHANGE_EVENT);
  },
  imagesLoaded: (rawAuthorImages) => {
    questionsService.initAuthorImages(rawAuthorImages);
    questionsEE.emit(CHANGE_EVENT);
  }
};

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

function ajaxCall(localStorageKey, url, dispatcherFunction) {
// trying to update the data from server, fallback is local storage
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {

    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        localStorage.setItem(localStorageKey, xmlhttp.response);
      }
      dispatcherFunction(localStorage.getItem(localStorageKey));
    }
  };
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}

export function initQuestions() {
  ajaxCall('questions', '/questions.json', dispatcher.questionsLoaded);
}

export function initAuthorImages() {
// trying to update the data from server, fallback is local storage
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {

    const localStorageKey = 'authorImages';
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        localStorage.setItem(localStorageKey, xmlhttp.response);
      }
      dispatcher.imagesLoaded(localStorage.getItem(localStorageKey));
    }
  };
  xmlhttp.open('GET', '/twitterImages.json', true);
  xmlhttp.send();
}

