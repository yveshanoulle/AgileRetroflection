'use strict';

const EventEmitter = require('events');

const Questions = require('./questionsRepository');

const CHANGE_EVENT = 'change';
const questionsEE = new EventEmitter();

const questionsService = new Questions();

function fireChange() {
  questionsEE.emit(CHANGE_EVENT);
}

const dispatcher = {  // exported for test
  questionsLoaded: (rawQuestions) => {
    questionsService.initQuestions(rawQuestions);
    fireChange();
  },
  imagesLoaded: (rawAuthorImages) => {
    questionsService.initAuthorImages(rawAuthorImages);
    fireChange();
  }
};

function addChangeListener(callback) {
  questionsEE.on(CHANGE_EVENT, callback);
}

function removeChangeListener(callback) {
  questionsEE.removeListener(CHANGE_EVENT, callback);
}

function service() {
  return questionsService;
}

function authorNamed(name) {
  return questionsService.authorNamed(decodeURIComponent(name)) || {name: '', questions: []};
}

function ajaxCall(localStorageKey, url, dispatcherFunction) {
// trying to update the data from server, fallback is local storage
  dispatcherFunction(localStorage.getItem(localStorageKey) || '[]');

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

function initQuestions() {
  ajaxCall('questions', '/questions.json', dispatcher.questionsLoaded);
}

function initAuthorImages() {
  ajaxCall('authorImages', '/twitterImages.json', dispatcher.imagesLoaded);
}

module.exports = {
  questionsService: questionsService,
  dispatcher: dispatcher,
  addChangeListener: addChangeListener,
  removeChangeListener: removeChangeListener,
  service: service,
  authorNamed: authorNamed,
  initQuestions: initQuestions,
  initAuthorImages: initAuthorImages
};
