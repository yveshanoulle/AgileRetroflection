var should = chai.should();

describe('helpers function for standard emails', function () {
  var result;
  var question = test_questions[0];
  beforeEach(function() {
    result = createMailURL(question);
  })

  it('creates mailto: without address', function () {
    result.should.contain('mailto:?');
  });

  it('contains the question text', function () {
    result.should.contain(question.question);
  });

  it('contains the question author', function () {
    result.should.contain(question.author);
  });

  it('contains the question id', function () {
    result.should.contain(question.id);
  });
});

describe('helpers function for correction emails', function () {
  var result;
  var question = test_questions[0];
  beforeEach(function() {
    result = createCorrectionMailURL(question);
  })

  it('creates mailto: with address "retroflections@hanoulle.be"', function () {
    result.should.contain('mailto:retroflections@hanoulle.be?');
  });

  it('contains the question text', function () {
    result.should.contain(question.question);
  });

  it('contains the question author', function () {
    result.should.contain(question.author);
  });

  it('contains the question id', function () {
    result.should.contain(question.id);
  });
});

describe('helpers function for twitter links', function () {

  it('creates link for twitter name', function () {
    var result = linkToTwitter('@yveshanoulle')
    result.should.contain('a href=\'http://twitter.com/yves');
    result.should.contain('@yveshanoulle');
  });

  it('creates no link for non twitter name', function () {
    var result = linkToTwitter('yveshanoulle')
    result.should.not.contain('a href=\'http://twitter.com/yves');
    result.should.contain('yveshanoulle');
    result.should.not.contain('@');
  });

});
