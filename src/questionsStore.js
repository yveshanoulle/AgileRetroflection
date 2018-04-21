const EventEmitter = require('events');

const Questions = require('./questionsRepository');

const CHANGE_EVENT = 'change';
const questionsEE = new EventEmitter();

const questionsService = new Questions();

function fireChange() {
  questionsEE.emit(CHANGE_EVENT);
}

const dispatcher = {
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


module.exports = {
  questionsService: questionsService,
  dispatcher: dispatcher,
  addChangeListener: addChangeListener,
  removeChangeListener: removeChangeListener,
  service: service,
  authorNamed: authorNamed
};
