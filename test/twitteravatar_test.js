'use strict';
const expect = require('must');

const questions = require('./test-questions.json');
const twitterusers = require('./test-twitterusers.json');
const twitteravatar = require('../server/twitteravatar');

describe('the twitteravatar module', () => {

  it('collects the names for the twitter query', () => {
    const twitterAPI = {
      getUserInfos: (names) => {
        expect(names).to.eql('Deborahh,didierkoc,k_ravlani,mfloryan,philagile,vinylbaustein,yveshanoulle');
      }
    };
    twitteravatar(twitterAPI, JSON.stringify(questions));
  });

  it('parses the result from twitter correctly', (done) => {
    const twitterAPI = {getUserInfos: () => {}};
    twitteravatar(twitterAPI, JSON.stringify(questions)).extractUrlsFromRaw(JSON.stringify(twitterusers), (err, result) => {
      expect(result).to.eql([{
        name: 'leiderleider',
        image: 'http://pbs.twimg.com/profile_images/1788222780/AndreasPlayfulWithRibbon_normal.jpg'
      }, {
        name: 'Retroflection',
        image: 'http://pbs.twimg.com/profile_images/604221243/3949464231_7c7531f034_normal.jpg'
      }]);
      done(err);
    });
  });

});
