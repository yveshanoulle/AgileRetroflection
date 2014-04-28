/*global test_questions*/
describe('The Controllers', function () {
  "use strict";
  var $scope;

  beforeEach(module('retroflection'));

  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope.$new();
  }));

  describe('The Root Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller, $state, questionService, authorService) {
        var lastQuestion, questionId, state = {go: function (to, param) {
          questionId = param.id;
        }};
        $controller('rootController', {
          $scope: $scope,
          $state: state,
          questions: test_questions,
          questionsService: questionService,
          authorService: authorService
        });

        expect($scope.questions.length).toEqual(15);
        expect($scope.authors.length).toEqual(7);

        $scope.nextQuestion();
        expect($scope.animationclass).toEqual('fade-left');
        expect(questionId).toBeGreaterThan(-1);
        expect(questionId).toBeLessThan(15);
        lastQuestion = questionId;

        $scope.previousQuestion();
        expect($scope.animationclass).toEqual('fade-right');
        expect(questionId).toEqual(lastQuestion);
      }
    ));
  });
  describe('The Question Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        $scope.questions = test_questions;
        $scope.nextQuestion = "placeholder for function nextQuestion";
        $scope.previousQuestion = "placeholder for function previousQuestion";
        $controller('questionController', {
          $scope: $scope,
          $stateParams: {id: 3}
        });

        expect($scope.swipeleft).toEqual($scope.nextQuestion);
        expect($scope.swiperight).toEqual($scope.previousQuestion);
        expect($scope.showQuestion).toBe(true);
      }
    ));
  });

  describe('The Authors Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        $controller('authorsController', {
          $scope: $scope
        });

        expect($scope.normname('@some name')).toEqual('some name');
        expect($scope.showAuthors).toBe(true);
      }
    ));
  });

  describe('The Authors Detail Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller, authorService) {
        $scope.authors = authorService(test_questions);
        $controller('authorDetailController', {
          $scope: $scope,
          $stateParams: {name: '@yveshanoulle'}
        });

        expect($scope.author.name).toEqual('@yveshanoulle');
        expect($scope.questions).toEqual($scope.author.questions);
        expect($scope.animationclass).toEqual('fade-left-right');
        expect($scope.showAuthors).toBe(true);
      }
    ));
  });

  describe('The About Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        $controller('aboutController', {
          $scope: $scope
        });

        expect($scope.animationclass).toEqual('fade-left-right');
        expect($scope.showAbout).toBe(true);
      }
    ));
  });
});
