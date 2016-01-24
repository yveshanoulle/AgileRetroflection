'use strict';
const http = require('http');
const base64 = require('base64-stream');
const concat = require('concat-stream');
const async = require('async');

const Questions = require('../src/repo/questionsRepository');

module.exports = function (twitterAPIInjected, questionString) {
  const twitterAPI = twitterAPIInjected || require('./twitterAPI');
  const allQuestions = new Questions().initQuestions(questionString).authors.distinctAuthors();
  const names = Array.from(allQuestions).map(each => each.replace('@', '')).toString();

  function loadImage(twitterdata, callback) {
    const url = twitterdata.profile_image_url;
    const req = http.request(url, function (res) {
      res
        .pipe(base64.encode())
        .pipe(concat(data => {
          callback(null, data.toString());
        }));
    });
    req.on('error', callback);
    req.end();
  }

  function extractUrlsFromRaw(data, callback) {
    const profiles = JSON.parse(data);
    const urls = {};
    async.each(profiles, (each, callback1) => {
      loadImage(each, (err, base64encodedImage) => {
        if (err) { /* eslint no-console: 0 */
          console.log(err);
        } //silent
        urls['@' + each.screen_name.toLowerCase()] = {
          realname: each.name,
          image: 'data:image/jpeg;base64,' + base64encodedImage
        };
        callback1();
      });
    }, () => {
      callback(null, urls);
    });
  }

  function retrieveImageURLs(callback) {
    twitterAPI.getUserInfos(names, function (err, data) {
      if (err) { return callback(err);}
      extractUrlsFromRaw(data, callback);
    });
  }

  return {
    extractUrlsFromRaw: extractUrlsFromRaw, // public for test
    loadImage: loadImage, // public for test
    retrieveImageURLs: retrieveImageURLs
  };
};
