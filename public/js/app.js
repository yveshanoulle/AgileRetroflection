/* global _, angular, questions */
"use strict";

angular.module('retroflection', ['ui.router', 'questionstore', 'ngTouch', 'ngAnimate'])

  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
      //$locationProvider.html5Mode(true);
      $stateProvider
        .state('retro', {
          abstract: true,
          resolve: {
            questions: function (questionstore) {
              return questionstore.questions();
            }
          },
          templateUrl: 'retro.tpl.html',
          controller: function ($scope, $state, questions, QuestionService) {
            $scope.questions = questions.data;
            $scope.authors = authors($scope.questions);
            QuestionService.numberOfQuestions($scope.questions.length);
            $scope.nextQuestion = function () {
              $scope.animationclass = 'fade-left';
              QuestionService.next();
            };
            $scope.previousQuestion = function () {
              $scope.animationclass = 'fade-right';
              QuestionService.previous();
            };
          }
        })
        .state('retro.question', {
          url: '/question/:id',
          views: {
            'nav-bar': {
              templateUrl: 'question-header.tpl.html',
              controller: function ($scope, $stateParams) {
                $scope.current = _.find($scope.questions, {"id": $stateParams.id});
                if ($scope.current) {
                  $scope.createMailURL = createMailURL($scope.current);
                  $scope.createCorrectionMailURL = createCorrectionMailURL($scope.current);
                }
              }
            },
            'content': {
              templateUrl: 'question.tpl.html',
              controller: function ($scope, $stateParams) {
                if (!$stateParams.id) { $scope.nextQuestion(); }
                $scope.current = _.find($scope.questions, {"id": $stateParams.id});
                $scope.twitterlink = linkToTwitter;
                $scope.swipeleft = function () { $scope.nextQuestion(); };
                $scope.swiperight = function () { $scope.previousQuestion(); };
              }
            },
            'buttons': {
              templateUrl: 'buttons.tpl.html',
              controller: function ($scope) {
                $scope.showQuestion = true;
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
                $scope.animationclass = '';
              }
            },
            'buttons': {
              templateUrl: 'buttons.tpl.html',
              controller: function ($scope) {
                $scope.showAuthors = true;
              }
            }
          }
        })
        .state('retro.author', {
          url: '/authors/:name',
          views: {
            'nav-bar': {
              template: '<a class="btn pull-left" ui-sref="retro.authors">back</a><h1 class="title">{{author.name}}</h1>',
              controller: function ($scope, $stateParams, $state) {
                $scope.author = _.find($scope.authors, {"name": $stateParams.name});
              }
            },
            'content': {
              templateUrl: 'author.tpl.html',
              controller: function ($scope, $stateParams) {
                $scope.questions = _.find($scope.authors, {"name": $stateParams.name}).questions;
                $scope.createCorrectionMailURL = createCorrectionMailURL;
                $scope.animationclass = 'fade-left-right';
              }
            },
            'buttons': {
              templateUrl: 'buttons.tpl.html',
              controller: function ($scope) {
                $scope.showAuthors = true;
              }
            }
          }
        })
        .state('retro.about', {
          url: '/about',
          views: {
            'nav-bar': {
              template: '<h1 class="title">About</h1>'
            },
            'content': {
              templateUrl: 'about.tpl.html',
              controller: function ($scope) {
                $scope.animationclass = '';
              }
            },
            'buttons': {
              templateUrl: 'buttons.tpl.html',
              controller: function ($scope) {
                $scope.showAbout = true;
              }
            }
          }
        });
      $urlRouterProvider.when('', '/index');
      $urlRouterProvider.otherwise('/question/');
    }]
)

  .service('QuestionService', ['$state', function ($state) {
    var questionNumbers = [];
    var questionsize;

    function numberOfQuestions(number) {
      questionsize = number;
    }

    function nextQuestion() {
      questionNumbers.push(Math.floor(Math.random() * questionsize));
      currentQuestionNumber();
    }

    function previousQuestion() {
      questionNumbers.pop();
      if (questionNumbers.length === 0) {
        return nextQuestion();
      }
      currentQuestionNumber();
    }

    function currentQuestionNumber() {
      $state.go('retro.question', { id: questionNumbers[questionNumbers.length - 1] });
    }

    return {
      next: nextQuestion,
      previous: previousQuestion,
      numberOfQuestions: numberOfQuestions
    };

  }]);
