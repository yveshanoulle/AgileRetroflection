/*global test_questions, jasmine*/
describe('The Controllers', function () {
  "use strict";
  var $scope, lastQuestion, questionId;

  beforeEach(module('retroflection'));

  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope.$new();
  }));

  beforeEach(inject(
    function ($controller, questionService, authorService) {
      var state = {
        go: function (to, param) {
          questionId = param.id;
        }
      };
      $controller('rootController', {
        $scope: $scope,
        $state: state,
        questions: test_questions,
        questionService: questionService,
        authorService: authorService
      });
    }
  ));

  describe('The Root Controller', function () {

    it('initializes the scope correctly', function () {
      expect($scope.questions.length).toEqual(15);
      expect($scope.authors.length).toEqual(7);
      expect($scope.questionService).not.toBeUndefined();

      $scope.nextQuestion();
      expect($scope.animationclass).toEqual('fade-left');
      expect(questionId).toBeGreaterThan(-1);
      expect(questionId).toBeLessThan(15);

      $scope.previousQuestion();
      expect($scope.animationclass).toEqual('fade-right');
    });

    it('navigates to the previous question', function () {
      $scope.nextQuestion();
      lastQuestion = questionId;
      $scope.nextQuestion();

      $scope.previousQuestion();
      expect(questionId).toEqual(lastQuestion);
    });

    it('never navigates before the start', function () {
      $scope.nextQuestion();
      lastQuestion = questionId;

      $scope.previousQuestion();
      expect(questionId).toEqual(lastQuestion);
    });
  });

  describe('The Question Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        $scope.nextQuestion = "placeholder for function nextQuestion";
        $scope.previousQuestion = "placeholder for function previousQuestion";
        $controller('questionController', {
          $scope: $scope,
          $stateParams: {id: '2'}
        });

        expect($scope.swipeleft).toEqual($scope.nextQuestion);
        expect($scope.swiperight).toEqual($scope.previousQuestion);
        expect($scope.showQuestion).toBe(true);
        expect($scope.current).toEqual(jasmine.objectContaining({id: '2', question: 'Q2'}));
      }
    ));
    
    it('return a valid question even if the id is not found', inject(
      function ($controller) {
        var nextQuestionCalled = false;
        $scope.nextQuestion = function () {
          nextQuestionCalled = true;
        };
        $scope.previousQuestion = "placeholder for function previousQuestion";
        $controller('questionController', {
          $scope: $scope,
          $stateParams: {id: '33'}
        });

        expect(nextQuestionCalled).toBe(true);
      }
    ));
  });

  describe('The Random Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        expect($scope.current).toBeUndefined();
        $controller('randomController', {$scope: $scope});
        expect($scope.current).not.toBeUndefined();
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
