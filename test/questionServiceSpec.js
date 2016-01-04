describe('the QuestionService', function () {
  'use strict';
  var service;

  beforeEach(module('retroflection'));

  beforeEach(inject(function (questionService) {
    service = questionService(15);
  }));

  it('chooses the same question for previous after initial question', function () {
    var current = service.next();
    expect(current + 1).to.be.truthy();
    expect(service.previous()).to.be(current);
  });

  it('chooses the previous question for previous after second question', function () {
    var first = service.next();
    service.next();
    expect(service.previous()).to.be(first);
  });

});
