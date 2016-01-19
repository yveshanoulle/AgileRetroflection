'use strict';
const Questions = require('../src/repo/questionsRepository');

//const names = 'leiderleider,retroflection';


module.exports = function (twitterAPIInjected, questionString) {
  const twitterAPI = twitterAPIInjected || require('./twitterAPI');
  const allQuestions = new Questions().initQuestions(questionString).authors.distinctAuthors();
  const names = Array.from(allQuestions).map(each => each.replace('@', '')).toString();

  function extractUrlsFromRaw(data, callback) {
    const profiles = JSON.parse(data);
    const urls = {};
    profiles.forEach(each => {
      urls['@' + each.screen_name.toLowerCase()] = {imageURL: each.profile_image_url, realname: each.name};
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
    extractUrlsFromRaw: extractUrlsFromRaw, // public for test
    retrieveImageURLs: retrieveImageURLs
  };
};

