'use strict';
const Questions = require('../src/repo/questionsRepository');

//const names = 'leiderleider,retroflection';


module.exports = function (twitterAPIInjected, questionString) {
  const twitterAPI = twitterAPIInjected || require('./twitterAPI');
  const allQuestions = new Questions(questionString).authors.distinctAuthors();
  const names = Array.from(allQuestions).map(each => each.replace('@', '')).toString();

  function extractUrlsFromRaw(data, callback) {
    const profiles = JSON.parse(data);
    const urls = profiles.map(each => {
      return {
        name: each.screen_name,
        image: each.profile_image_url
      };
    });

    callback(null, urls);
  }

  function retrieveImageURLs(callback) {
    twitterAPI.getUserInfos(names, function (err, data) {
      if (err) { return callback(err);}
      extractUrlsFromRaw(data, callback);
    });
  }

  return {
    extractUrlsFromRaw: extractUrlsFromRaw,
    retrieveImageURLs: retrieveImageURLs
  };
};

