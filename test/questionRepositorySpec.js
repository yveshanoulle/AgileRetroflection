'use strict';

const expect = require('must');

const Questions = require('../src/repo/questionsRepository');
const testQuestions = require('./test-questions.json');
const testTwitterImages = require('./test-twitterImages.json');

describe('questions function', () => {
  const service = new Questions().initQuestions(JSON.stringify(testQuestions));

  it('gives a requested question', () => {
    expect(service.questionFor('1')).to.eql({question: 'Q1', author: '@Deborahh', id: '1', date: '1/23/2012'});
    expect(service.questionFor('11')).to.eql({question: 'Q11 with \"escapes\"', author: '@yveshanoulle', id: '11'});
  });

  it('gives an empty question when id provided is not found', () => {
    expect(service.questionFor(23)).to.eql({question: '', author: '', id: '', date: ''});
  });
});

describe('authors function', () => {
  const service = new Questions().initQuestions(JSON.stringify(testQuestions)).authors;
  service.initAuthorImages(testTwitterImages);

  it('parses the test_questions to 8 distinct authors strings', () => {
    expect(service.all.length).to.be(8);
  });

  it('parses the test_questions to 7 distinct authors', () => {
    expect(service.distinctCount()).to.be(7);
  });

  it('contains Yves with 5 test_questions (even though his name is in different cases)', () => {
    service.all.forEach((question) => {
      if (question.name === '@yveshanoulle') {
        expect(question.questions.length).to.be(4);
      }
    });
  });

  it('contains Yves with 5 test_questions (even though his name is in different cases)', () => {
    service.all.forEach((question) => {
      if (question.name === '@yveshAnouLLe') {
        expect(question.questions.length).to.be(4);
      }
    });
  });

  it('sorts the authors by name', () => {
    let lastName = '';
    service.all.forEach((question) => {
      let currentName = question.name;
      expect(lastName.localeCompare(currentName)).to.be.below(0);
      lastName = currentName;
    });
  });

  it('augments an author with his imageURL and realname', () => {
    let author = service.authorNamed('@yveshanoulle');
    expect(author.imageURL).to.be('http://pbs.twimg.com/profile_images/604221243/3949464231_7c7531f034_normal.jpg');
    expect(author.realname).to.be('Retro Retro');
  });

  it('augments an author with his imageURL (ignoring case in name)', () => {
    let author = service.authorNamed('@Deborahh');
    expect(author.imageURL).to.be('http://pbs.twimg.com/profile_images/1788222780/AndreasPlayfulWithRibbon_normal.jpg');
    expect(author.realname).to.be('Leider\'s real name');
  });

  it('augments an author pair with the imageURL of the first', () => {
    let author = service.authorNamed('@yveshanoulle & @vinylbaustein');
    expect(author.imageURL).to.be('http://pbs.twimg.com/profile_images/604221243/3949464231_7c7531f034_normal.jpg');
  });
});
