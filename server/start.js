'use strict';

const app = require('./server');
const retrieveQuestions = require('./retrieve-questions');
const fs = require('fs');

const server = require('http').createServer(app);

server.listen(process.env.PORT || 5000, () => {
  /* eslint no-console: 0 */
  console.log('Server running');
});
retrieveQuestions();
setInterval(retrieveQuestions, 1000 * 60 * 60 * 24);
setInterval(() => {
  fs.exists('public/questions.json', (exists) => {
    if (!exists) { retrieveQuestions(); }
  });
}, 1000 * 60); // check every minute if questions.json exists

