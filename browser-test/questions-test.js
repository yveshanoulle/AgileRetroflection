var should = chai.should();

describe('the questions', function () {
  beforeEach(function(){
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

});