'use strict';
const expect = require('must');
const fs = require('fs');

const questions = require('./dummydata/test-questions.json');
const twitterusers = require('./dummydata/test-twitterusers.json');
const twitterImages = require('./dummydata/test-twitterImages.json');
const twitteravatar = require('../server/twitteravatar');

describe('the twitteravatar module', () => {

  it('collects the names for the twitter query', () => {
    const twitterAPI = {
      getUserInfos: names => {
        expect(names).to.eql('Deborahh,didierkoc,k_ravlani,mfloryan,philagile,vinylbaustein,yveshanoulle');
      }
    };
    twitteravatar(twitterAPI, JSON.stringify(questions));
  });

  it('parses the result from twitter correctly', (done) => {
    const twitterAPI = {getUserInfos: () => {}};
    twitteravatar(twitterAPI, JSON.stringify(questions)).extractUrlsFromRaw(JSON.stringify(twitterusers), (err, result) => {
      expect(result).to.eql(twitterImages);
      done(err);
    });
  });

  it('encodes retrieved jpgs with base64', (done) => {
    const twitterAPI = {getUserInfos: () => {}};
    const leiderleider = twitterusers[0];
    twitteravatar(twitterAPI, '[]').loadImage(leiderleider, (err, result) => {
      expect(result).to.match('4AAQSkZJRgABAQEBLAEsAAD');
      fs.readFile('test/dummydata/AndreasPlayfulWithRibbon_normal.jpg', function (err1, data) {
        expect(result).to.eql(new Buffer(data).toString('base64'));
        done(err);
      });
    });
  });
});
