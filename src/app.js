/* global _ */
"use strict";

angular.module('retroflection', ['ui.router', 'questionstore', 'ngTouch', 'ngAnimate', 'templates'])

  .config(['$stateProvider', '$urlRouterProvider', 'templates',
    function ($stateProvider, $urlRouterProvider, templates) {
      $stateProvider
        .state('retro', {
          abstract: true,
          resolve: {
            questions: function (questionstore) {
              return questionstore.questions();
            }
          },
          template: templates.retrotpl,
          controller: function ($scope, $state, questions, questionService, authorService) {
            $scope.questions = questions;
            $scope.authors = authorService($scope.questions);
            var service = questionService($scope.questions.length);
            $scope.nextQuestion = function () {
              $scope.animationclass = 'fade-left';
              $state.go('retro.question', { id: service.next() });
            };
            $scope.previousQuestion = function () {
              $scope.animationclass = 'fade-right';
              $state.go('retro.question', { id: service.previous() });
            };
          }
        })
        .state('retro.question', {
          url: '/question/:id',
          views: {
            'nav-bar': {
              template: templates.questionheadertpl,
              controller: function ($scope, $stateParams) {
                $scope.current = _.find($scope.questions, {"id": $stateParams.id});
              }
            },
            'content': {
              template: templates.questiontpl,
              controller: function ($scope, $stateParams) {
                if (!$stateParams.id) { return $scope.nextQuestion(); }
                $scope.current = _.find($scope.questions, {"id": $stateParams.id});
                $scope.swipeleft = $scope.nextQuestion;
                $scope.swiperight = $scope.previousQuestion;
              }
            },
            'buttons': {
              template: templates.buttontpl,
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
              template: templates.authorstpl,
              controller: function ($scope) {
                $scope.normname = function (name) {
                  return name.substr(1);
                };
                $scope.animationclass = '';
              }
            },
            'buttons': {
              template: templates.buttontpl,
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
              controller: function ($scope, $stateParams) {
                $scope.author = _.find($scope.authors, {"name": $stateParams.name});
              }
            },
            'content': {
              template: templates.authortpl,
              controller: function ($scope, $stateParams) {
                $scope.questions = _.find($scope.authors, {"name": $stateParams.name}).questions;
                $scope.animationclass = 'fade-left-right';
              }
            },
            'buttons': {
              template: templates.buttontpl,
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
              template: templates.abouttpl,
              controller: function ($scope) {
                $scope.animationclass = 'fade-left-right';
              }
            },
            'buttons': {
              template: templates.buttontpl,
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

  .directive('twitterLink', function () {
    return {
      restrict: 'E',
      scope: {
        name: '='
      },
      template: '<a href="{{link}}">{{name}}</a>',
      replace: true,
      link: function (scope) {
        var name = scope.name || ' ';
        scope.link = (name.charAt(0) === '@') ? 'http://twitter.com/' + name.substr(1) : '#';
      }
    };
  })

  .directive('mailQuestion', function () {
    return {
      restrict: 'E',
      scope: {
        question: '='
      },
      template: '<a href="{{link}}" ng-transclude=></a>',
      transclude: true,
      replace: true,
      link: function (scope) {
        var question = scope.question;
        scope.link = question ? 'mailto:?subject=Retroflection Question ' + question.id + '&body=' +
          encodeURI('"' + question.question + '"' + ' by ' + question.author) +
          encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
            '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
      }
    };
  })

  .directive('correctQuestion', function () {
    return {
      restrict: 'E',
      scope: {
        question: '='
      },
      template: '<a href="{{link}}" ng-transclude=></a>',
      transclude: true,
      replace: true,
      link: function (scope) {
        var question = scope.question;
        scope.link = question ? 'mailto:retroflections@hanoulle.be?subject=Retroflection corrected question&body=' +
          encodeURI('I have a proposal on improving the spelling of retroflection question ' +
            question.id + ': \n' + '"' + question.question + '" by ' + question.author) +
          encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n' +
            'This retroflection was originally twittered by @retroflection' +
            '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
      }
    };
  })

  .factory('questionService', function () {
    return function (questionsize) {
      var questionNumbers = [];

      function nextQuestion() {
        questionNumbers.push(Math.floor(Math.random() * questionsize));
        return currentQuestionNumber();
      }

      function previousQuestion() {
        if (questionNumbers.length > 1) {
          questionNumbers.pop();
        }
        return currentQuestionNumber();
      }

      function currentQuestionNumber() {
        return questionNumbers[questionNumbers.length - 1];
      }

      return {
        next: nextQuestion,
        previous: previousQuestion
      };
    };
  })

  .factory('authorService', function () {
    return function (questions) {
      var internal = [];

      function addAuthor(author) {
        internal.push({name: author, questions: []});
      }

      function getAuthorNamed(name) {
        return _.find(internal, {name: name});
      }

      function sort() {
        internal.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
      }

      for (var i in questions) {
        var question = questions[i];
        var name = question.author;
        if (!getAuthorNamed(name)) { addAuthor(name); }
        getAuthorNamed(name).questions.push(question);
      }
      sort();
      return internal;
    };
  });
