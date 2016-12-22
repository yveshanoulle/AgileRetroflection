const nconf = require('./init-nconf');

var config = {
  'consumerKey': nconf.get('TWITTER_CONSUMER_KEY'),
  'consumerSecret': nconf.get('TWITTER_CONSUMER_SECRET'),
  'accessToken': nconf.get('TWITTER_ACCESS_TOKEN'),
  'accessTokenSecret': nconf.get('TWITTER_ACCESS_TOKEN_SECRET'),
  'callBackUrl': 'http://retroflection.org'
};

const Twitter = require('twitter-node-client').Twitter;
const twitter = new Twitter(config);

module.exports = {
  getUserInfos: (names, callback) => {
    twitter.getCustomApiCall('/users/lookup.json', {'screen_name': names},
      err => callback(err),
      data => callback(null, data));
  }
};
