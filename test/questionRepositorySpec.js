'use strict';

const expect = require('must');

const Questions = require('../src/repo/questionsRepository');
const testQuestions = require('./test-questions.json');

describe('questions function', () => {
  const service = new Questions(JSON.stringify(testQuestions));

  it('gives a requested question', () => {
    expect(service.questionFor('1')).to.eql({question: 'Q1', author: '@Deborahh', id: '1', date: '1/23/2012'});
    expect(service.questionFor('11')).to.eql({question: 'Q11 with \"escapes\"', author: '@yveshanoulle', id: '11'});
  });

  it('gives an empty question when id provided is not found', () => {
    expect(service.questionFor(23)).to.eql({question: '', author: '', id: '', date: ''});
  });
});

describe('authors function', () => {
  const service = new Questions(JSON.stringify(testQuestions)).authors;

  it('parses the test_questions to 8 distinct authors strings', () => {
    expect(service.all.length).to.be(8);
  });

  it('parses the test_questions to 7 distinct authors', () => {
    expect(service.distinctCount()).to.be(7);
  });

  it('contains Yves with 5 test_questions', () => {
    service.all.forEach((question) => {
      if (question.name === '@yveshanoulle') {
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
});
