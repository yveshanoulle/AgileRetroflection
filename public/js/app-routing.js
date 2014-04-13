/* global _, angular, questions */
"use strict";

angular.module('retroflection', ['ui.router', 'app', 'questionstore'])

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('retro', {
        abstract: true,
        url: '/retro',
        resolve: {
          questions: function (questionstore) {
            return questionstore.questions();
          }
        },
        templateUrl: 'retro.tpl.html',
        controller: function ($scope, $state, questions, QuestionService) {
          $scope.questions = questions.data;
          $scope.authors = authors($scope.questions);
          $scope.nextQuestion = function () {QuestionService.next($scope.questions.length); };
        }
      })
      .state('retro.question', {
        url: '/question/:id',
        views: {
          'nav-bar': {
            templateUrl: 'question-header.tpl.html',
            controller: function ($scope, $stateParams) {
              $scope.current = _.find($scope.questions, {"id": $stateParams.id});
              $scope.createMailURL = createMailURL($scope.current);
              $scope.createCorrectionMailURL = createCorrectionMailURL($scope.current);
            }
          },
          'content': {
            templateUrl: 'question.tpl.html',
            controller: function ($scope, $stateParams) {
              if (!$stateParams.id) { $scope.nextQuestion(); }
              $scope.current = _.find($scope.questions, {"id": $stateParams.id});
              $scope.twitterlink = linkToTwitter;
            }
          }
        }
      })
      .state('retro.authors', {
        url: '/authors',
        views: {
          'nav-bar': {
            template: '<h1 class="title">Authors</h1>'
          },
          'content': {
            templateUrl: 'authors.tpl.html',
            controller: function ($scope) {
              $scope.normname = function (name) {
                return name.substr(1);
              };
            }
          }
        }
      })
      .state('retro.author', {
        url: '/authors/:name',
        views: {
          'nav-bar': {
            template: '<h1 class="title">Author</h1>'
          },
          'content': {
            templateUrl: 'author.tpl.html',
            controller: function ($scope, $stateParams) {
              $scope.author = _.find($scope.authors, {"name": $stateParams.name});
            }
          }
        }
      });
    $urlRouterProvider.when('', '/index');
    $urlRouterProvider.otherwise('/retro/question/');
  }
)

  .service('QuestionService', function ($state) {
    var questionNumbers = [];

    function nextQuestion(questionsize) {
      questionNumbers.push(Math.floor(Math.random() * questionsize));
      currentQuestionNumber();
    }

    function previousQuestion() {
      questionNumbers.pop();
      currentQuestionNumber();
    }

    function currentQuestionNumber() {
      $state.go('retro.question', { id: questionNumbers[questionNumbers.length - 1] });
    }

    return {
      next: nextQuestion,
      previous: previousQuestion
    };

  });
