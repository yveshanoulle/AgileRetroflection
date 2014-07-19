describe('directive', function () {
  "use strict";

  var $rootScope, $compile;

  beforeEach(module('retroflection'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  describe('for twitter links', function () {
    it('creates link for twitter name', function () {
      $rootScope.name = '@yveshanoulle';
      var element = $compile('<twitter-link name="name"></twitter-link>')($rootScope);
      $rootScope.$digest();
      expect(element[0].href).toMatch('http://twitter.com/yveshanoulle');
    });

    it('creates no link for non twitter name', function () {
      $rootScope.name = 'yveshanoulle';
      var element = $compile('<twitter-link name="name"></twitter-link>')($rootScope);
      $rootScope.$digest();
      expect(element[0].href).toMatch('#');
      expect(element[0].href).not.toMatch('http://twitter.com/yveshanoulle');
    });
  });

  describe('for question mails', function () {
    var element, question = {"question": "Q1", "author": "@deborahh", "id": "976"};

    beforeEach(function () {
      $rootScope.question = question;
      element = $compile('<mail-question question="question">blabla</mail-question>')($rootScope);
      $rootScope.$digest();

    });

    it('creates mailto: without address', function () {
      expect(element[0].href).toMatch('mailto:?');
    });

    it('contains the question text', function () {
      expect(element[0].href).toMatch(question.question);
    });

    it('contains the question author', function () {
      expect(element[0].href).toMatch(question.author);
    });

    it('contains the question id', function () {
      expect(element[0].href).toMatch(question.id);
    });

    it('retains the inner html stuff', function () {
      expect(element[0].innerHTML).toMatch('blabla');
    });
  });

  describe('for correction mails', function () {
    var element, question = {"question": "Q1", "author": "@deborahh", "id": "976"};

    beforeEach(function () {
      $rootScope.question = question;
      element = $compile('<correct-question question="question">blabla</correct-question>')($rootScope);
      $rootScope.$digest();

    });

    it('creates mailto: with address "retroflections@hanoulle.be"', function () {
      expect(element[0].href).toMatch('mailto:retroflections@hanoulle.be?');
    });

    it('contains the question text', function () {
      expect(element[0].href).toMatch(question.question);
    });

    it('contains the question author', function () {
      expect(element[0].href).toMatch(question.author);
    });

    it('contains the question id', function () {
      expect(element[0].href).toMatch(question.id);
    });

    it('retains the inner html stuff', function () {
      expect(element[0].innerHTML).toMatch('blabla');
    });
  });
});
