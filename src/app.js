(function () {
  "use strict";

  angular.module('retroflection', ['ui.router', 'questionstore', 'ngTouch', 'ngAnimate', 'templates'])

    .config(['$stateProvider', '$urlRouterProvider', 'templates',
      function ($stateProvider, $urlRouterProvider, templates) {
        $stateProvider
          .state('retro', {
            abstract: true,
            resolve: {
              questions: ['questionstore', function (questionstore) {
                return questionstore.questions();
              }]
            },
            template: templates.retrotpl,
            controller: 'rootController'
          })
          .state('retro.question', {
            url: '/question/:id',
            views: {
              'nav-bar': {
                template: templates.questionheadertpl,
                controller: 'questionController'
              },
              'content': {
                template: templates.questiontpl,
                controller: 'questionController'
              },
              'buttons': {
                template: templates.buttontpl,
                controller: 'questionController'
              }
            }
          })
          .state('retro.random', {
            url: '/random',
            views: {
              'nav-bar': {
                template: templates.questionheadertpl,
                controller: 'randomController'
              },
              'content': {
                template: templates.questiontpl,
                controller: 'randomController'
              },
              'buttons': {
                template: templates.buttontpl,
                controller: 'randomController'
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
                controller: 'authorsController'
              },
              'buttons': {
                template: templates.buttontpl,
                controller: 'authorsController'
              }
            }
          })
          .state('retro.author', {
            url: '/authors/:name',
            views: {
              'nav-bar': {
                template: '<a class="btn pull-left" ui-sref="retro.authors">back</a><h1 class="title">{{author.name}}</h1>',
                controller: 'authorDetailController'
              },
              'content': {
                template: templates.authortpl,
                controller: 'authorDetailController'
              },
              'buttons': {
                template: templates.buttontpl,
                controller: 'authorDetailController'
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
                controller: 'aboutController'
              },
              'buttons': {
                template: templates.buttontpl,
                controller: 'aboutController'
              }
            }
          });
        $urlRouterProvider.when('', '/index');
        $urlRouterProvider.otherwise('/question/');
      }])

    .controller('rootController', [
      '$scope',
      '$state',
      'questions',
      'questionService',
      'authorService',
      function ($scope, $state, questions, questionService, authorService) {
        $scope.questions = questions;
        $scope.authors = authorService($scope.questions);
        var service = questionService($scope.questions.length);
        $scope.questionService = service;
        $scope.nextQuestion = function () {
          $scope.animationclass = 'fade-left';
          $state.go('retro.question', { id: service.next() });
        };
        $scope.previousQuestion = function () {
          $scope.animationclass = 'fade-right';
          $state.go('retro.question', { id: service.previous() });
        };
      }])

    .controller('questionController', [
      '$scope',
      '$stateParams',
      function ($scope, $stateParams) {
        if (!$stateParams.id) { return $scope.nextQuestion(); }
        $scope.current = _.find($scope.questions, {"id": $stateParams.id});
        $scope.swipeleft = $scope.nextQuestion;
        $scope.swiperight = $scope.previousQuestion;
        $scope.showQuestion = true;
      }])

    .controller('randomController', [
      '$scope',
      function ($scope) {
        $scope.current = _.find($scope.questions, {"id": $scope.questionService.next().toString()});
        $scope.showQuestion = true;
      }])

    .controller('authorsController', [
      '$scope',
      function ($scope) {
        $scope.normname = function (name) { return name.substr(1); };
        $scope.animationclass = '';
        $scope.showAuthors = true;
      }])

    .controller('authorDetailController', [
      '$scope',
      '$stateParams',
      function ($scope, $stateParams) {
        $scope.author = _.find($scope.authors, {"name": $stateParams.name});
        $scope.questions = $scope.author.questions;
        $scope.animationclass = 'fade-left-right';
        $scope.showAuthors = true;
      }])

    .controller('aboutController', [
      '$scope',
      function ($scope) {
        $scope.animationclass = 'fade-left-right';
        $scope.showAbout = true;
      }])

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

        function currentQuestionNumber() {
          return questionNumbers[questionNumbers.length - 1];
        }

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

        _.each(questions, function (question) {
          var name = question.author;
          if (!getAuthorNamed(name)) { addAuthor(name); }
          getAuthorNamed(name).questions.push(question);
        });
        sort();
        return internal;
      };
    });
}());
