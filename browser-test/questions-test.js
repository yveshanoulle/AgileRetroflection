var should = chai.should();

describe('the questions', function () {
  beforeEach(function () {
    questions = test_questions;
  });

  it('has 15 test_questions', function () {
    questions.length.should.equal(15);
  });

  it('chooses the same question for previous after initial question', function () {
    var current = currentQuestion();
    current.should.be.ok;
    previousQuestion();
    currentQuestion().should.equal(current);
  });

  it('chooses the previous question for previous after second question', function () {
    var first = currentQuestion();
    first.should.be.ok;
    nextQuestion();
    var next = currentQuestion();
    next.should.be.ok;
    previousQuestion();
    currentQuestion().should.equal(first);
  });

  it('gives the correct "lastUpdate" maximum', function () {
    var maxTime = latestUpdate();
    maxTime.should.equal(1366494122380);
  });

  it('gives the correct "lastUpdate" maximum for no questions', function () {
    questions = undefined;
    var maxTime = latestUpdate();
    maxTime.should.equal(0);
  });

  it('replaces updated questions', function () {
    var newQuestions = JSON.parse('[{"question": "Q6-new", "author": "@yveshanoulle", "id": "980", "_id": "515445d0ad390ec17100046f", "lastSave": 1366494122388}]');
    replaceOrAddQuestions(newQuestions);
    questions.length.should.equal(15);
    questions.forEach(function (question) {
      if (question.id === "980") {
        question.question.should.equal("Q6-new");
      }
    })
  });

  it('adds new questions', function () {
    var newQuestions = JSON.parse('[{"question": "Brand-new", "author": "@yveshanoulle", "id": "2000", "_id": "515445d0ad390ec17100046X", "lastSave": 1366494122388}]');
    replaceOrAddQuestions(newQuestions);
    questions.length.should.equal(16);
    questions.forEach(function (question) {
      if (question.id === "2000") {
        question.question.should.equal("Brand-new");
      }
    })
  });

});
