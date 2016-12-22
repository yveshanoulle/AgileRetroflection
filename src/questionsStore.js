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
    const needsUpdate = questionsService.all.length === 0;
    questionsService.initQuestions(rawQuestions);
    if (needsUpdate) {
      fireChange();
    }
  },
  imagesLoaded: (rawAuthorImages) => {
    const needsUpdate = questionsService.authors.authorImages.length === 0;
    questionsService.initAuthorImages(rawAuthorImages);
    if (needsUpdate) {
      fireChange();
    }
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
  try {
    dispatcherFunction(localStorage.getItem(localStorageKey) || '[]');
  } catch (e) {
    dispatcherFunction('[]');
  }

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {

    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) {
        try {
          JSON.stringify(xmlhttp.response);
          localStorage.setItem(localStorageKey, xmlhttp.response);
          dispatcherFunction(localStorage.getItem(localStorageKey));
        } catch (e) {
          // do nothing
        }
      }
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
