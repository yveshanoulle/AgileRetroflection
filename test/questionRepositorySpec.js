const expect = require('must');

const Questions = require('../src/questionsRepository');

describe('questions function', () => {
  const service = new Questions();

  it('gives a requested question', () => {
    expect(service.questionFor('1')).to.eql({question: 'If you could change 1 thing today what would it be?', author: '@YvesHanoulle', id: '1', date: '1/1/2010'});
  });

  it('gives a new random question each time', () => {
    const first = service.next();
    const second = service.next();
    const third = service.next();
    expect(first).to.not.eql(second);
    expect(second).to.not.eql(third);
  });

  it('is re-entrant', () => {
    expect(service.all).to.have.length(2910);
    const serviceAgain = new Questions();
    expect(serviceAgain.all).to.have.length(2910);
  });
});

describe('authors function', () => {
  const service = new Questions().authors;

  it('parses the test_questions to 90 distinct authors strings', () => {
    expect(service.all).to.have.length(90);
  });

  it('contains Yves with 5 test_questions (even though his name is in different cases)', () => {
    service.all.forEach(author => {
      if (author.name === '@yveshanoulle') {
        expect(author.questions).to.have.length(5);
      }
    });
  });

  it('contains vinylbaustein with 4 test_questions (even though he is only co-author in one)', () => {
    service.all.forEach(author => {
      if (author.name === '@vinylbaustein') {
        expect(author.questions).to.have.length(237);
      }
    });
  });

  it('sorts the authors by name', () => {
    let lastName = '';
    service.all.forEach(author => {
      const currentName = author.name;
      expect(lastName.localeCompare(currentName)).to.be.below(0);
      lastName = currentName;
    });
  });

  it('augments an author with his image and realname', () => {
    const author = service.authorNamed('@yveshanoulle');
    expect(author.image).to.match('data:image\/jpeg;base64,\/9j/4AAQSkZJRgABAQEASABIAAD\/2wBDAAgGBgcGBQgHBwcJCQgKDBQ');
    expect(author.realname).to.be('Yves Hanoulle');
  });

});
