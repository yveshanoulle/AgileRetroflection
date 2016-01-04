describe('directive', function () {
  'use strict';

  var $rootScope, $compile, element, question = {'question': 'Q1', 'author': '@deborahh', 'id': '976'};

  beforeEach(module('retroflection'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  describe('for question mails', function () {

    beforeEach(function () {
      $rootScope.question = question;
      element = $compile('<mail-question question="question">blabla</mail-question>')($rootScope);
      $rootScope.$digest();

    });

    it('creates mailto: without address', function () {
      expect(element[0].href).to.match('mailto:?');
    });

    it('contains the question text', function () {
      expect(element[0].href).to.match(question.question);
    });

    it('contains the question author', function () {
      expect(element[0].href).to.match(question.author);
    });

    it('contains the question id', function () {
      expect(element[0].href).to.match(question.id);
    });

    it('retains the inner html stuff', function () {
      expect(element[0].innerHTML).to.match('blabla');
    });
  });

  describe('for correction mails', function () {
    beforeEach(function () {
      $rootScope.question = question;
      element = $compile('<correct-question question="question">blabla</correct-question>')($rootScope);
      $rootScope.$digest();

    });

    it('creates mailto: with address "retroflections@hanoulle.be"', function () {
      expect(element[0].href).to.match('mailto:retroflections@hanoulle.be?');
    });

    it('contains the question text', function () {
      expect(element[0].href).to.match(question.question);
    });

    it('contains the question author', function () {
      expect(element[0].href).to.match(question.author);
    });

    it('contains the question id', function () {
      expect(element[0].href).to.match(question.id);
    });

    it('retains the inner html stuff', function () {
      expect(element[0].innerHTML).to.match('blabla');
    });
  });
});
