describe('The Controllers', function () {
  'use strict';
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
      expect($scope.questions.length).to.be(15);
      expect($scope.authors.length).to.be(8);
      expect($scope.questionService).to.exist();

      $scope.nextQuestion();
      expect($scope.animationclass).to.be('fade-left');
      expect(questionId).to.be.above(-1);
      expect(questionId).to.be.below(17);

      $scope.previousQuestion();
      expect($scope.animationclass).to.be('fade-right');
    });

    it('navigates to the previous question', function () {
      $scope.nextQuestion();
      lastQuestion = questionId;
      $scope.nextQuestion();

      $scope.previousQuestion();
      expect(questionId).to.be(lastQuestion);
    });

    it('never navigates before the start', function () {
      $scope.nextQuestion();
      lastQuestion = questionId;

      $scope.previousQuestion();
      expect(questionId).to.be(lastQuestion);
    });
  });

  describe('The Question Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        $scope.nextQuestion = 'placeholder for function nextQuestion';
        $scope.previousQuestion = 'placeholder for function previousQuestion';
        $controller('questionController', {
          $scope: $scope,
          $stateParams: {id: '2'}
        });

        expect($scope.swipeleft).to.be($scope.nextQuestion);
        expect($scope.swiperight).to.be($scope.previousQuestion);
        expect($scope.showQuestion).to.be(true);
        expect($scope.current).to.have.ownProperty('id', '2');
        expect($scope.current).to.have.ownProperty('question', 'Q2');
      }
    ));

    it('return a valid question even if the id is not found', inject(
      function ($controller) {
        var nextQuestionCalled = false;
        $scope.nextQuestion = function () {
          nextQuestionCalled = true;
        };
        $scope.previousQuestion = 'placeholder for function previousQuestion';
        $controller('questionController', {
          $scope: $scope,
          $stateParams: {id: '33'}
        });

        expect(nextQuestionCalled).to.be(true);
      }
    ));
  });

  describe('The Random Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        expect($scope.current).to.be.undefined();
        $controller('randomController', {$scope: $scope});
        expect($scope.current).to.exist();
      }
    ));
  });

  describe('The Authors Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        $controller('authorsController', {
          $scope: $scope
        });

        expect($scope.normname('@some name')).to.be('some name');
        expect($scope.showAuthors).to.be(true);
      }
    ));
  });

  describe('The Authors Detail Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller, authorService) {
        $scope.authors = authorService(test_questions).all;
        $controller('authorDetailController', {
          $scope: $scope,
          $stateParams: {name: '@yveshanoulle'}
        });

        expect($scope.author.name).to.be('@yveshanoulle');
        expect($scope.questions).to.be($scope.author.questions);
        expect($scope.animationclass).to.be('fade-left-right');
        expect($scope.showAuthors).to.be(true);
      }
    ));
  });

  describe('The About Controller', function () {
    it('initializes the scope correctly', inject(
      function ($controller) {
        $controller('aboutController', {
          $scope: $scope
        });

        expect($scope.animationclass).to.be('fade-left-right');
        expect($scope.showAbout).to.be(true);
      }
    ));
  });
});
