const expect = require('must');
const fs = require('fs');

const questions = require('./dummydata/test-questions.json');
const twitterusers = require('./dummydata/test-twitterusers.json');
const twitterImages = require('./dummydata/test-twitterImages.json');
const twitteravatar = require('../server/twitteravatar');

describe('the twitteravatar module', () => {

  it('collects the names for the twitter query (integration)', (done) => {
    const twitterAPI = {
      getUserInfos: (names, callback) => {
        expect(names).to.eql('Deborahh,didierkoc,k_ravlani,mfloryan,philagile,vinylbaustein,yveshanoulle');
        callback(null, JSON.stringify(twitterusers));
      }
    };
    twitteravatar(twitterAPI, JSON.stringify(questions)).retrieveImageURLs((err, results) => {
      expect(results).to.eql(twitterImages);
      done(err);
    });
  });

  it('parses the result from twitter correctly', (done) => {
    const twitterAPI = {getUserInfos: () => {}};
    twitteravatar(twitterAPI, JSON.stringify(questions)).extractUrlsFromRaw(JSON.stringify(twitterusers), (err, result) => {
      expect(result).to.eql(twitterImages);
      done(err);
    });
  });

});
