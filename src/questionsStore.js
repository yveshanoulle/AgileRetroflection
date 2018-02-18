const Questions = require('./questionsRepository');

const questionsService = new Questions();

function service() {
  return questionsService;
}

function authorNamed(name) {
  return questionsService.authorNamed(decodeURIComponent(name)) || {name: '', questions: []};
}


module.exports = {
  questionsService: questionsService,
  service: service,
  authorNamed: authorNamed
};
